import { columns } from "./columns";
import { DataTable } from "../../../_components/table/data-table";
import { getSuppliers } from "../supplier.action";
import { Heading } from "@/src/components/heading";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export async function SuppliersDataTable() {
  const suppliers = await getSuppliers();

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <Heading
          title="Suppliers"
          description="Manage your supplier relationships"
        />
        <Button className="ml-auto">
          <Link
            href={"/dashboard/suppliers/add"}
            className="flex items-center gap-1"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Supplier
          </Link>
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={suppliers || []}
        searchKey="name"
        searchPlaceholder="Search suppliers..."
      />
    </div>
  );
}
