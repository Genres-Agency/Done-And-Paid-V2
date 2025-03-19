"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product, Supplier, Inventory } from "@prisma/client";
import { columns } from "./columns";
import { DataTable } from "../../../_components/table/data-table";
import { LoadingPage } from "@/src/components/loading";
import { getProducts } from "../product.action";
import { Heading } from "@/src/components/heading";

type ProductWithRelations = Product & {
  supplier: Supplier;
  inventory: Inventory | null;
};

export function ProductsDataTable() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <Heading
          title="Products"
          description="Manage your product catalog and inventory"
        />
        <Button
          onClick={() => router.push("/dashboard/products/add")}
          className="ml-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center pt-6 w-full">
          <LoadingPage />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={products}
          searchKey="name"
          searchPlaceholder="Search products..."
          onRefresh={fetchProducts}
        />
      )}
    </div>
  );
}
