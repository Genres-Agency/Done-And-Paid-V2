"use client";

import { Heading } from "@/src/components/heading";
import ProductForm from "../_components/product-form";

export default function AddProductPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Add Product"
        description="Add a new product to your catalog"
      />
      <ProductForm />
    </div>
  );
}
