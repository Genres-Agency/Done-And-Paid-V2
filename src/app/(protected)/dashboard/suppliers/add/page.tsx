import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import SupplierForm from "../_components/supplier-form";

export default function AddSupplierPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between gap-4 w-full">
        <h1 className="text-3xl font-bold">Add New Supplier</h1>
        <Button variant="ghost" className="flex items-center gap-2" asChild>
          <Link href={`/dashboard/suppliers`}>
            <ArrowLeft className="h-4 w-4" /> Back to Suppliers
          </Link>
        </Button>
      </div>
      <Separator />
      <SupplierForm />
    </div>
  );
}
