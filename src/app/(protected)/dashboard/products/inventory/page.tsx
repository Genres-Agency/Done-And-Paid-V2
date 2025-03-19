"use client";

import { useEffect, useState } from "react";
import { Product, Supplier, Inventory } from "@prisma/client";
import { Separator } from "@/src/components/ui/separator";
import { getProducts } from "../product.action";
import { DataTable } from "../../../_components/table/data-table";
import { columns } from "../_components/columns";
import { Heading } from "@/src/components/heading";

type ProductWithDetails = Product & {
  supplier: Supplier | null;
  inventory: Inventory | null;
};

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts(false);
        setProducts(data ?? []);
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Inventory Management"
          description="Monitor and manage your product inventory levels"
        />
        <Separator />
        <DataTable columns={columns} data={products} searchKey="name" />
      </div>
    </div>
  );
}
