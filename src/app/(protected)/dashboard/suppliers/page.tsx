import { SuppliersDataTable } from "./_components/suppliers-data-table";
import PageContainer from "../../_components/page-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suppliers | Done & Paid",
  description: "Manage all your suppliers in one place",
};

export default function SuppliersPage() {
  return (
    <PageContainer>
      <SuppliersDataTable />
    </PageContainer>
  );
}
