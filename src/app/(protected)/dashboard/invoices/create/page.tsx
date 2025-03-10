import { Metadata } from "next";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import CreateInvoiceForm from "../_components/create-invoice-form";

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
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Create New Invoice</h1>
      <CreateInvoiceForm />
    </div>
  );
}
