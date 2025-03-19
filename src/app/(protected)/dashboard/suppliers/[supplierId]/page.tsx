import { notFound } from "next/navigation";
import { getSupplierById } from "../supplier.action";
import SupplierContent from "./_components/supplier-content";
import PageContainer from "../../../_components/page-container";

interface SupplierPageProps {
  params: {
    supplierId: string;
  };
}

export default async function SupplierPage({ params }: SupplierPageProps) {
  const supplier = await getSupplierById(params.supplierId);

  if (!supplier) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="flex-1 flex-col">
        <SupplierContent supplier={supplier} />
      </div>
    </PageContainer>
  );
}
