"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Invoice } from "@prisma/client";

import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Loading from "@/src/app/loading";
import { Separator } from "@/src/components/ui/separator";

type InvoiceWithCustomer = Invoice & {
  customer: {
    name: string;
    phoneNumber: string | null;
    email: string | null;
    address: string | null;
  };
  InvoiceItem: {
    product: {
      name: string;
    };
    quantity: number;
    unitPrice: number;
  }[];
};

export default function InvoiceDetailsPage() {
  const params = useParams();
  const [invoice, setInvoice] = useState<InvoiceWithCustomer | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <Loading />;
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  const dueDate = new Date(invoice.dueDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="flex items-center gap-2" asChild>
          <Link href="/dashboard/invoices">
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/dashboard/invoices/edit/${params.invoiceNumber}`}>
            Edit Invoice
          </Link>
        </Button>
      </div>

      <div className="bg-white shadow-md mx-auto w-[21cm] min-h-[29.7cm] p-[1.5cm]">
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
              <p className="text-gray-600 font-medium">
                {invoice.customer.name}
              </p>
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
                <span className="font-medium">Status:</span>{" "}
                {invoice.paymentStatus}
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
                    <td className="py-3 px-4 text-gray-900">
                      {item.product.name}
                    </td>
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
                <span className="font-medium">
                  +{invoice.taxValue.toFixed(2)}%
                </span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Notes:
              </h3>
              <p className="text-gray-600">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
