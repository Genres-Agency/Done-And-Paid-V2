"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Invoice } from "@prisma/client";
import { Heading } from "@/src/components/heading";
import Link from "next/link";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import { InvoiceForm } from "../../create/_components/invoice-form";
import { LoadingPage } from "@/src/components/loading";
import PageContainer from "@/src/app/(protected)/_components/page-container";
import { ArrowLeft } from "lucide-react";

import { InvoiceWithCustomer } from "@/src/types/invoice";

export default function EditInvoicePage() {
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
    return <LoadingPage />;
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading
            title={`Edit Invoice: ${invoice.invoiceNumber}`}
            description="Edit and update your invoice details"
          />
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href={`/dashboard/invoices/${params.invoiceNumber}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Invoice
            </Link>
          </Button>
        </div>
        <Separator />
        <InvoiceForm initialData={invoice} />
      </div>
    </PageContainer>
  );
}
