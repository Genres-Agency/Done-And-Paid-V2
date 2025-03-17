"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Invoice } from "@prisma/client";

import { Button } from "@/src/components/ui/button";
import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import Loading from "@/src/app/loading";
import { Separator } from "@/src/components/ui/separator";
import PageContainer from "../../../_components/page-container";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";

import { InvoiceWithCustomer } from "@/src/types/invoice";

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceWithCustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${params.invoiceNumber}`);
        if (!response.ok) throw new Error("Failed to fetch invoice");
        const data = await response.json();
        setInvoice(data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [params.invoiceNumber]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/invoices/${params.invoiceNumber}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete invoice");
      router.push("/dashboard/invoices");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  const dueDate = new Date(invoice.dueDate);

  const InvoiceContent = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {invoice.businessName}
          </h2>
          <p className="text-gray-600">{invoice.businessAddress}</p>
          <p className="text-gray-600">{invoice.businessPhone}</p>
          <p className="text-gray-600">{invoice.businessEmail}</p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="flex justify-between items-start gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">Bill To:</h3>
          <p className="text-gray-600 font-medium">{invoice.customer.name}</p>
          <p className="text-gray-600">{invoice.customer.address}</p>
          <p className="text-gray-600">{invoice.customer.phoneNumber}</p>
          <p className="text-gray-600">{invoice.customer.email}</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="flex justify-between bg-white p-4 rounded-lg border">
        <div className="space-y-2">
          <p className="text-gray-900">
            <span className="font-medium">Invoice Number:</span>{" "}
            {invoice.invoiceNumber}
          </p>
          <p className="text-gray-900">
            <span className="font-medium">Date:</span>{" "}
            {new Date(invoice.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-900">
            <span className="font-medium">Due Date:</span>{" "}
            {dueDate.toLocaleDateString()}
          </p>
          <p className="text-gray-900">
            <span className="font-medium">Status:</span> {invoice.paymentStatus}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">
                Item
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">
                Quantity
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">
                Unit Price
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.InvoiceItem.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{item.product.name}</td>
                <td className="text-right py-3 px-4 text-gray-600">
                  {item.quantity}
                </td>
                <td className="text-right py-3 px-4 text-gray-600">
                  {item.unitPrice.toFixed(2)}
                </td>
                <td className="text-right py-3 px-4 text-gray-900 font-medium">
                  {(item.quantity * item.unitPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="ml-auto w-72 space-y-2 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span className="font-medium">
            {invoice.InvoiceItem.reduce(
              (sum, item) => sum + item.quantity * item.unitPrice,
              0
            ).toFixed(2)}
          </span>
        </div>
        {invoice.discountValue > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Discount:</span>
            <span className="font-medium text-red-600">
              -{invoice.discountValue.toFixed(2)}%
            </span>
          </div>
        )}
        {invoice.taxValue > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Tax:</span>
            <span className="font-medium">+{invoice.taxValue.toFixed(2)}%</span>
          </div>
        )}
        <Separator className="my-2" />
        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total:</span>
          <span>
            {(() => {
              const subtotal = invoice.InvoiceItem.reduce(
                (sum, item) => sum + item.quantity * item.unitPrice,
                0
              );
              const discountAmount = invoice.discountValue
                ? (subtotal * invoice.discountValue) / 100
                : 0;
              const taxAmount = invoice.taxValue
                ? ((subtotal - discountAmount) * invoice.taxValue) / 100
                : 0;
              return (subtotal - discountAmount + taxAmount).toFixed(2);
            })()}
          </span>
        </div>
      </div>

      {/* Notes Section */}
      {invoice.notes && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes:</h3>
          <p className="text-gray-600">{invoice.notes}</p>
        </div>
      )}
    </div>
  );

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/dashboard/invoices">
              <ArrowLeft className="h-4 w-4" />
              Back to Invoices
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[1000px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Invoice Preview</DialogTitle>
                </DialogHeader>
                <div className="bg-white shadow-md mx-auto w-[21cm] min-h-[29.7cm] p-[1.5cm]">
                  <InvoiceContent />
                </div>
              </DialogContent>
            </Dialog>
            <Button asChild>
              <Link href={`/dashboard/invoices/${params.invoiceNumber}/edit`}>
                Edit Invoice
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the invoice.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="bg-white shadow-md mx-auto w-[21cm] min-h-[29.7cm] p-[1.5cm]">
          <InvoiceContent />
        </div>
      </div>
    </PageContainer>
  );
}
