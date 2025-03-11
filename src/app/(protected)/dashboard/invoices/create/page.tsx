import { Metadata } from "next";
import { UserRole } from "@prisma/client";
import { Heading } from "@/src/components/heading";
import Link from "next/link";
import { Separator } from "@/src/components/ui/separator";
import PageContainer from "../../../_components/page-container";
import { InvoiceForm } from "./_components/invoice-form";
import { Suspense } from "react";
import { LoadingPage } from "@/src/components/loading";
import { Button } from "@/src/components/ui/button";

export const metadata: Metadata = {
  title: "Create Invoice | Done & Paid",
  description: "Create a new invoice for your customer",
};

export default async function CreateInvoicePage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Create New Invoice`}
            description="Create and customize your invoice"
          />
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            <Link href="#preview">Preview Invoice</Link>
          </Button>
        </div>
        <Separator />
        <Suspense fallback={<LoadingPage />}>
          <InvoiceForm />
        </Suspense>
      </div>
    </PageContainer>
  );
}
