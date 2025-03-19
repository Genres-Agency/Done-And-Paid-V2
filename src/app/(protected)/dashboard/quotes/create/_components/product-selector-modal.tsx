"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Search } from "lucide-react";
import { Product } from "@prisma/client";

interface ProductSelectorModalProps {
  onSelect: (product: Product) => void;
}

export function ProductSelectorModal({ onSelect }: ProductSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products");
      const products = await response.json();
      console.log("products======>", products);
      setProducts(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      fetchAllProducts();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/products/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to search products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          type="button"
          size="sm"
          onClick={() => {
            setIsOpen(true);
            fetchAllProducts();
          }}
        >
          <Search className="h-4 w-4 mr-2" />
          Select Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchProducts(e.target.value);
              }}
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center py-4">Loading...</div>
              </div>
            ) : null}
            <div className={loading ? "opacity-50" : ""}>
              {products.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 px-4">Name</th>
                      <th className="py-2 px-4">SKU</th>
                      <th className="py-2 px-4 text-right">Price</th>
                      <th className="py-2 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-2 px-4">{product.name}</td>
                        <td className="py-2 px-4">{product.sku}</td>
                        <td className="py-2 px-4 text-right">
                          {product.price.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              onSelect(product);
                              setIsOpen(false);
                            }}
                          >
                            Select
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No products found
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
