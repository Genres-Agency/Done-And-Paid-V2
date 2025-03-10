import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { UserRole } from "@prisma/client";
import { getPendingInvoices } from "@/src/app/(protected)/dashboard/invoices/invoice.action";
import InvoiceList from "../_components/invoice-ui/invoice-list";

export const metadata: Metadata = {
  title: "Pending Payments | Done & Paid",
  description: "Manage pending invoice payments",
};

const allowedRoles = [
  UserRole.ADMIN,
  UserRole.SUPERADMIN,
  UserRole.MANAGER,
  UserRole.ACCOUNTANT,
];

export default async function PendingPaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !allowedRoles.includes(session.user.role as UserRole)) {
    redirect("/dashboard");
  }

  const invoices = await getPendingInvoices();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pending Payments</h1>
      </div>
      <InvoiceList invoices={invoices} />
    </div>
  );
}
