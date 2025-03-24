"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProjectStatus } from "@prisma/client";
import { Badge } from "@/src/components/ui/badge";
import { format } from "date-fns";
import { DataTableColumnHeader } from "../../../_components/table/data-table-column-header";
import { DataTableRowActions } from "../../../_components/table/data-table-row-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { deleteProject } from "../project.action";

type Project = {
  id: string;
  title: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  budget: number | null;
  timeline: Date | null;
  requirements: string | null;
  status: ProjectStatus;
  createdAt: Date;
  assignedUser: {
    name: string | null;
  } | null;
};

const statusColorMap: Record<ProjectStatus, string> = {
  PENDING: "bg-yellow-500",
  APPROVED: "bg-blue-500",
  IN_PROGRESS: "bg-purple-500",
  COMPLETED: "bg-green-500",
  CANCELLED: "bg-red-500",
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project Title" />
    ),
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client Name" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as ProjectStatus;
      return (
        <Badge className={`${statusColorMap[status]} text-white`}>
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "budget",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Budget" />
    ),
    cell: ({ row }) => {
      const budget = row.getValue("budget") as number;
      if (!budget) return "-";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(budget);
    },
  },
  {
    accessorKey: "timeline",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Timeline" />
    ),
    cell: ({ row }) => {
      const timeline = row.getValue("timeline") as Date;
      if (!timeline) return "-";
      return format(new Date(timeline), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "assignedUser",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned To" />
    ),
    cell: ({ row }) => {
      const assignedUser = row.getValue("assignedUser") as {
        name: string;
      } | null;
      return assignedUser?.name || "-";
    },
  },
  //   {
  //     accessorKey: "createdAt",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="Created At" />
  //     ),
  //     cell: ({ row }) => {
  //       return format(new Date(row.getValue("createdAt")), "MMM dd, yyyy");
  //     },
  //   },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();
      const project = row.original;
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);

      const handleDelete = async () => {
        try {
          const result = await deleteProject(project.id);
          if (!result.success) {
            throw new Error(result.error);
          }
          toast.success("Project deleted successfully");
          router.refresh();
        } catch (error) {
          toast.error("Error deleting project");
          console.error("Error deleting project:", error);
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
                onClick: () => router.push(`/dashboard/projects/${project.id}`),
              },
              {
                label: "Edit",
                onClick: () =>
                  router.push(`/dashboard/projects/${project.id}/edit`),
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
                  project.
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
