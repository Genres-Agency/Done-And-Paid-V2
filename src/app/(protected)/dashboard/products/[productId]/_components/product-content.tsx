import { Product, Supplier, Inventory } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";

interface ProductContentProps {
  product: Product & {
    supplier: Supplier;
    inventory: Inventory | null;
  };
}

export default function ProductContent({ product }: ProductContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/products/${product.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" size="sm">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Product Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">SKU</p>
              <p className="font-medium">{product.sku}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{product.description}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-medium">${product.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cost</p>
              <p className="font-medium">${product.cost.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Inventory Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.inventory ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Current Stock</p>
                  <p className="font-medium">{product.inventory.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Minimum Stock Level
                  </p>
                  <p className="font-medium">{product.inventory.minStock}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock Status</p>
                  <p
                    className={`font-medium ${
                      product.inventory.quantity <= product.inventory.minStock
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {product.inventory.quantity <= product.inventory.minStock
                      ? "Low Stock"
                      : "In Stock"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No inventory information available
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Supplier Information</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Supplier Name</p>
              <p className="font-medium">{product.supplier.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Contact Information
              </p>
              <p className="font-medium">{product.supplier.email}</p>
              <p className="font-medium">{product.supplier.phoneNumber}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
