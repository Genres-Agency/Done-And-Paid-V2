// app/(protected)/dashboard/products/[productId]/edit/page.tsx

import { notFound } from "next/navigation";
import ProductForm from "../../_components/product-form";
import { getProductById } from "../../product.action";
import PageContainer from "@/src/app/(protected)/_components/page-container";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between gap-4 w-full">
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href={`/dashboard/products/${productId}`}>
              <ArrowLeft className="h-4 w-4" /> Back to Product
            </Link>
          </Button>
        </div>

        <ProductForm initialData={product} />
      </div>
    </PageContainer>
  );
}
