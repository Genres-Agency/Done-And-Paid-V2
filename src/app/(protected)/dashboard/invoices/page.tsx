import React, { Suspense } from "react";
import { Metadata } from "next";
import { UserRole } from "@prisma/client";
import { getInvoices } from "@/src/app/(protected)/dashboard/invoices/invoice.action";
import InvoiceList from "./_components/invoice-ui/invoice-list";
import { LoadingPage } from "@/src/components/loading";

export const metadata: Metadata = {
  title: "Invoices | Done & Paid",
  description: "Manage all your invoices in one place",
};

const allowedRoles = [
  UserRole.ADMIN,
  UserRole.SUPERADMIN,
  UserRole.MANAGER,
  UserRole.ACCOUNTANT,
];

export default async function InvoicesPage() {
  try {
    const invoices = await getInvoices();
    return (
      <div className="overflow-x-auto">
        <Suspense fallback={<LoadingPage />}>
          <InvoiceList invoices={invoices} />
        </Suspense>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">
            Failed to fetch invoices. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
