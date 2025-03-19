"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product, Supplier, Inventory } from "@prisma/client";
import { useRouter } from "next/navigation";
import { DataTableColumnHeader } from "../../../_components/table/data-table-column-header";
import { DataTableRowActions } from "../../../_components/table/data-table-row-actions";
import { Badge } from "@/src/components/ui/badge";
import { toast } from "sonner";
import { deleteProduct } from "../product.action";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";

type ProductWithRelations = Product & {
  supplier: Supplier;
  inventory: Inventory | null;
};

export const columns: ColumnDef<ProductWithRelations, any>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return formatted;
    },
  },
  {
    accessorKey: "inventory.quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
    cell: ({ row }) => {
      const quantity = row.original.inventory?.quantity || 0;
      const minStock = row.original.inventory?.minStock || 0;
      return (
        <div className="flex items-center gap-2">
          <Badge
            variant={quantity <= minStock ? "destructive" : "default"}
            className="rounded-md"
          >
            {quantity}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "supplier.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const product = row.original;
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);

      const handleDelete = async () => {
        try {
          await deleteProduct(product.id);
          toast.success("Product deleted successfully");
          router.refresh();
        } catch (error) {
          toast.error("Invalid supplier ID");
          console.error("Error deleting product:", error);
        }
        setShowDeleteDialog(false);
      };

      return (
        <>
          <DataTableRowActions
            row={row}
            actions={[
              {
                label: "View Details",
                onClick: () => router.push(`/dashboard/products/${product.id}`),
              },
              {
                label: "Edit",
                onClick: () =>
                  router.push(`/dashboard/products/${product.id}/edit`),
              },
              {
                label: "Delete",
                onClick: () => setShowDeleteDialog(true),
              },
            ]}
          />
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  product.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
];
