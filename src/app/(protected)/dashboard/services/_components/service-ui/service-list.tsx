"use client";

import { Heading } from "@/src/components/heading";
import { DataTable } from "../../../../_components/table/data-table";
import { columns } from "./columns";
import { statuses } from "./data/data";
import { Separator } from "@/src/components/ui/separator";
import PageContainer from "@/src/app/(protected)/_components/page-container";
import { ServiceItem } from "./data/data";
import { useRouter } from "next/navigation";

export default function ServiceList({ services }: { services: ServiceItem[] }) {
  const totalServices = services.length;

  const router = useRouter();
  const handleRefresh = async () => {
    router.refresh();
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Total Services (${totalServices})`}
            description="View all dental services"
          />
        </div>
        <Separator />
        <div className="relative w-full">
          <div className="overflow-x-auto">
            <DataTable
              data={services}
              columns={columns}
              searchKey="titleEn"
              filterKey="status"
              onRefresh={handleRefresh}
              filterOptions={statuses}
              searchPlaceholder="Search by title..."
              filterPlaceholder="Filter by status"
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
