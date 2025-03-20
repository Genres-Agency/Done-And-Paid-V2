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
  onSelect: (products: Product[]) => void;
  append?: (data: any) => void;
}

export function ProductSelectorModal({
  onSelect,
  append,
}: ProductSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products");
      const products = await response.json();
      // console.log("products======>", products);
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
            setSelectedProducts(new Set());
            fetchAllProducts();
          }}
        >
          <Search className="h-4 w-4 mr-2" />
          Select Products
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
            <div className="flex items-center gap-2">
              {/* {selectedProducts.size > 0 && (
                <Badge variant="secondary">{selectedProducts.size}</Badge>
              )} */}
              <Button
                type="button"
                onClick={() => {
                  const selectedProductsList = products.filter((p) =>
                    selectedProducts.has(p.id)
                  );
                  onSelect(selectedProductsList);
                  if (append) {
                    selectedProductsList.forEach((product) => {
                      const newItem = {
                        name: product.name,
                        description: product.description || "",
                        quantity: 1,
                        unitPrice: product.price,
                        productId: product.id,
                        total: product.price,
                        discountType: "percentage",
                        discountValue: 0,
                        taxType: "percentage",
                        taxValue: 0,
                      };
                      append(newItem);
                    });
                  }
                  setIsOpen(false);
                }}
                disabled={selectedProducts.size === 0}
              >
                {selectedProducts.size > 0 ? `${selectedProducts.size} - ` : ""}{" "}
                Add Selected
              </Button>
            </div>
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
                        <td className="py-2 px-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedProducts);
                              if (e.target.checked) {
                                newSelected.add(product.id);
                              } else {
                                newSelected.delete(product.id);
                              }
                              setSelectedProducts(newSelected);
                            }}
                            className="mr-2"
                          />
                          {product.name}
                        </td>
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
                              const newSelected = new Set([product.id]);
                              setSelectedProducts(newSelected);
                              onSelect([product]);
                              if (append) {
                                const newItem = {
                                  name: product.name,
                                  description: product.description || "",
                                  quantity: 1,
                                  unitPrice: product.price,
                                  productId: product.id,
                                  total: product.price,
                                  discountType: "percentage",
                                  discountValue: 0,
                                  taxType: "percentage",
                                  taxValue: 0,
                                };
                                append(newItem);
                              }
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
