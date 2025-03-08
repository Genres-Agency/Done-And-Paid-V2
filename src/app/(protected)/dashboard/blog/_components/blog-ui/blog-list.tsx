import { Heading } from "@/src/components/heading";
import { DataTable } from "../../../../_components/table/data-table";
import { columns } from "./columns";
import { getCategoryOptions } from "./data/data";
import { statuses } from "./data/data";
import { Separator } from "@/src/components/ui/separator";
import PageContainer from "@/src/app/(protected)/_components/page-container";

export default function BlogList({
  allBlogs,
  categories,
}: {
  allBlogs: any[];
  categories: any[];
}) {
  const categoryOptions = getCategoryOptions(categories);
  const totalBlogs = allBlogs.length;

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Total Blogs (${totalBlogs})`}
            description="View all dental blog posts"
          />
        </div>
        <Separator />
        <div className="relative w-full">
          <div className="overflow-x-auto">
            <DataTable
              data={allBlogs}
              columns={columns(categories)}
              searchKey="titleEn"
              filterKey="status"
              filterOptions={statuses}
              categoryOptions={categoryOptions}
              searchPlaceholder="Search by title..."
              filterPlaceholder="Filter by status"
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}