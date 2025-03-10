"use client";

import { Heading } from "@/src/components/heading";
import { columns } from "./columns";
import { Separator } from "@/src/components/ui/separator";
import PageContainer from "@/src/app/(protected)/_components/page-container";
import { Invoice } from "@prisma/client";
import { useRouter } from "next/navigation";
import { DataTable } from "@/src/app/(protected)/_components/table/data-table";
import Link from "next/link";

type InvoiceWithRelations = Invoice & {
  customer: {
    name: string;
  };
};

type InvoiceListProps = {
  invoices: InvoiceWithRelations[];
};

export default function InvoiceList({ invoices }: InvoiceListProps) {
  const totalInvoices = invoices.length;
  const router = useRouter();

  const handleRefresh = async () => {
    router.refresh();
  };

  const statuses = [
    { label: "Paid", value: "PAID" },
    { label: "Pending", value: "PENDING" },
    { label: "Overdue", value: "OVERDUE" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Total Invoices (${totalInvoices})`}
            description="Manage your invoices"
          />
          <Link
            href="/dashboard/invoices/create"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            Create Invoice
          </Link>
        </div>
        <Separator />
        <div className="relative w-full">
          <div className="overflow-x-auto">
            <DataTable
              data={invoices}
              columns={columns}
              searchKey="customer.name"
              filterKey="paymentStatus"
              onRefresh={handleRefresh}
              filterOptions={statuses}
              searchPlaceholder="Search by customer..."
              filterPlaceholder="Filter by status"
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
