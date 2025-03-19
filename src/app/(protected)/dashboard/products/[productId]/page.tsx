import { notFound } from "next/navigation";
import { getProductById } from "../product.action";
import ProductContent from "./_components/product-content";
import PageContainer from "../../../_components/page-container";

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.productId);

  if (!product) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="flex-1 flex-col">
        <ProductContent product={product} />
      </div>
    </PageContainer>
  );
}
