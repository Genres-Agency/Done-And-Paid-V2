"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataTableColumnHeader } from "../../../_components/table/data-table-column-header";
import { DataTableRowActions } from "../../../_components/table/data-table-row-actions";
import { toast } from "sonner";
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

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/suppliers/${row.original.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {row.original.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
  },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
];

// Create a separate component for the actions cell
const ActionCell = ({ row }: { row: any }) => {
  const router = useRouter();
  const supplier = row.original;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      // TODO: Implement delete functionality
      toast.success("Supplier deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Error deleting supplier");
      console.error("Error deleting supplier:", error);
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
            onClick: () => router.push(`/dashboard/suppliers/${supplier.id}`),
          },
          {
            label: "Edit",
            onClick: () =>
              router.push(`/dashboard/suppliers/${supplier.id}/edit`),
          },
          {
            label: "Delete",
            onClick: () => setShowDeleteDialog(true),
          },
        ]}
      />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              supplier.
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
};
