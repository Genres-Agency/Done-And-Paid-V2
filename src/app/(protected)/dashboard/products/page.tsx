import { Heading } from "@/src/components/heading";
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
      <div className="flex-1 space-y-4">
        <Heading
          title="Products"
          description="Manage your product catalog and inventory"
        />
        <ProductsDataTable />
      </div>
    </PageContainer>
  );
}
