import { Separator } from "@/src/components/ui/separator";
import { DataTable } from "../../../../_components/table/data-table";
import { columns } from "./columns";
import { categoryStatuses } from "./data/data";
import { getAllCategories } from "../../categories-action";
import PageContainer from "@/src/app/(protected)/_components/page-container";
import { Heading } from "@/src/components/heading";

export default async function CategoriesListPage() {
  const [categories] = await Promise.all([getAllCategories()]);
  const totalCategories = categories.length;

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Categories (${totalCategories})`}
            description="Manage news categories"
          />
        </div>
        <Separator />
        <div className="relative w-full">
          <div className="overflow-x-auto">
            <DataTable
              data={categories}
              columns={columns}
              searchKey="name"
              filterKey="status"
              filterOptions={categoryStatuses}
              filterPlaceholder="Filter by status"
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
