import { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { Heading } from "@/src/components/heading";
import Link from "next/link";
import { Separator } from "@/src/components/ui/separator";
import PageContainer from "../../../_components/page-container";
import { InvoiceForm } from "./_components/invoice-form";

export const metadata: Metadata = {
  title: "Create Invoice | Done & Paid",
  description: "Create a new invoice for your customer",
};

const allowedRoles = [
  UserRole.ADMIN,
  UserRole.SUPERADMIN,
  UserRole.MANAGER,
  UserRole.ACCOUNTANT,
];

export default async function CreateInvoicePage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Create New Invoices`}
            description="Create your invoices"
          />
          <Link
            href="/dashboard/invoices/create"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            View Invoice
          </Link>
        </div>
        <Separator />
        <InvoiceForm />
      </div>
    </PageContainer>
  );
}
