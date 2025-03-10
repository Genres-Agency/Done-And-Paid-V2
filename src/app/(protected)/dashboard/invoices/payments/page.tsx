import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { UserRole } from "@prisma/client";
import { getPaymentHistory } from "@/src/app/(protected)/dashboard/invoices/invoice.action";
import InvoiceList from "../_components/invoice-ui/invoice-list";

export const metadata: Metadata = {
  title: "Payment History | Done & Paid",
  description: "View all invoice payment history",
};

const allowedRoles = [
  UserRole.ADMIN,
  UserRole.SUPERADMIN,
  UserRole.MANAGER,
  UserRole.ACCOUNTANT,
];

export default async function PaymentHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !allowedRoles.includes(session.user.role as UserRole)) {
    redirect("/dashboard");
  }

  const invoices = await getPaymentHistory();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment History</h1>
      </div>
      <InvoiceList invoices={invoices} />
    </div>
  );
}
