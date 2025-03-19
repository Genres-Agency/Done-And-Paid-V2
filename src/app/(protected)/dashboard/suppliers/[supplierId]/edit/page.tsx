import { notFound } from "next/navigation";
import SupplierForm from "../../_components/supplier-form";
import { getSupplierById } from "../../supplier.action";
import PageContainer from "@/src/app/(protected)/_components/page-container";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditSupplierPageProps {
  params: {
    supplierId: string;
  };
}

export default async function EditSupplierPage({
  params,
}: EditSupplierPageProps) {
  const supplier = await getSupplierById(params.supplierId);

  if (!supplier) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between gap-4 w-full">
          <h1 className="text-3xl font-bold">Edit Supplier</h1>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href={`/dashboard/suppliers/${params.supplierId}`}>
              <ArrowLeft className="h-4 w-4" /> Back to Supplier
            </Link>
          </Button>
        </div>

        <SupplierForm initialData={supplier} />
      </div>
    </PageContainer>
  );
}
