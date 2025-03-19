"use client";
import { Button } from "@/src/components/ui/button";
import { Product, Supplier } from "@prisma/client";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { deleteSupplier } from "../../supplier.action";
import { useState } from "react";

interface SupplierContentProps {
  supplier: Supplier & {
    products: Product[];
  };
}

export default function SupplierContent({ supplier }: SupplierContentProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <div className="flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/dashboard/suppliers">
              <ArrowLeft className="h-4 w-4" /> Back to Suppliers
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link href={`/dashboard/suppliers/${supplier.id}/edit`}>
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                disabled={isDeleting}
              >
                <Trash className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  supplier
                  {supplier.products.length > 0 &&
                    " and may affect associated products"}
                  .
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      setIsDeleting(true);
                      await deleteSupplier(supplier.id);
                      window.location.href = "/dashboard/suppliers";
                    } catch (error) {
                      console.error("Error deleting supplier:", error);
                      setIsDeleting(false);
                    }
                  }}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="space-y-4 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold">Company Information</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Company Name:</span>
              <p>{supplier.company || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium">Tax Number:</span>
              <p>{supplier.taxNumber || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Name:</span>
              <p>{supplier.name}</p>
            </div>
            <div>
              <span className="font-medium">Email:</span>
              <p>{supplier.email || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium">Phone:</span>
              <p>{supplier.phoneNumber || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold">Address</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Address:</span>
              <p>{supplier.address || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold">Additional Information</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Notes:</span>
              <p className="whitespace-pre-wrap">{supplier.notes || "N/A"}</p>
            </div>
            <div>
              <span className="font-medium">Created At:</span>
              <p>{new Date(supplier.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>
              <p>{new Date(supplier.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6 rounded-lg border col-span-2">
          <h2 className="text-xl font-semibold">Products</h2>
          <div className="space-y-2">
            {supplier.products && supplier.products.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {supplier.products.map((product) => (
                  <div key={product.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                    <p className="mt-2">Price: ${product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No products associated with this supplier
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
