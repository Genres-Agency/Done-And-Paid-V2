import { ProductsDataTable } from "./_components/products-data-table";
import PageContainer from "../../_components/page-container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Done & Paid",
  description: "Manage all your products in one place",
};
export default function ProductsPage() {
  return (
    <PageContainer>
      <ProductsDataTable />
    </PageContainer>
  );
}
