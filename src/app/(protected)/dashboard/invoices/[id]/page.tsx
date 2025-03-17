"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Invoice } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Loading from "@/src/app/loading";

type InvoiceWithCustomer = Invoice & {
  customer: {
    name: string;
  };
};

export default function InvoiceDetailsPage() {
  const params = useParams();
  const [invoice, setInvoice] = useState<InvoiceWithCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${params.id}`);
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
  }, [params.id]);

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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Invoice Information</h3>
                <div className="mt-2 space-y-2">
                  <p className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">
                      Invoice Number:
                    </span>
                    <span className="font-medium">{invoice.invoiceNumber}</span>
                  </p>
                  <p className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">{invoice.paymentStatus}</span>
                  </p>
                  <p className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-medium">
                      {dueDate.toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Customer Information</h3>
                <div className="mt-2 space-y-2">
                  <p className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-medium">
                      {invoice.customer?.name || "N/A"}
                    </span>
                  </p>
                  <p className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">
                      ${invoice.total.toFixed(2)}
                    </span>
                  </p>
                  <p className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Notes:</span>
                    <span className="font-medium">
                      {invoice.notes || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
