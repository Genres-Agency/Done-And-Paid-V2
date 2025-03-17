"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Loading from "@/src/app/loading";
import { Separator } from "@/src/components/ui/separator";
import PageContainer from "../../../_components/page-container";
import { InvoiceWithCustomer } from "@/src/types/invoice";
import { ActionBar } from "./_components/action-bar";
import { InvoiceContent } from "./_components/invoice-content";

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

  return (
    <PageContainer>
      <div className="space-y-4 pb-24">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/dashboard/invoices">
              <ArrowLeft className="h-4 w-4" />
              Back to Invoices
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/invoices/${invoice.invoiceNumber}/edit`}>
              Edit Invoice
            </Link>
          </Button>
        </div>
        <Separator />
        <InvoiceContent invoice={invoice} />
      </div>
      <ActionBar
        invoice={invoice}
        isDeleting={isDeleting}
        onDelete={handleDelete}
      />
    </PageContainer>
  );
}
