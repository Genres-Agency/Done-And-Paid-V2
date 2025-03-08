"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/src/components/ui/badge";
import { format } from "date-fns";
import { Appointment } from "@prisma/client";
import { DataTableColumnHeader } from "../../../../_components/table/data-table-column-header";
import { DataTableRowActions } from "../../../../_components/table/data-table-row-actions";
import { useState } from "react";
import { AppointmentDetailsModal } from "./appointment-details-modal";
import { useCurrentRole } from "@/src/hooks/use-current-role";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
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
import { EditAppointmentDialog } from "./edit-appointment-dialog";
import { deleteAppointment, updateAppointment } from "../../data";

interface AppointmentWithRelations extends Appointment {
  patient: {
    name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  dentist: {
    name: string | null;
    email: string | null;
  } | null;
  service: {
    titleEn: string;
    price: number;
  } | null;
  branch: {
    nameEn: string;
    nameBn: string;
  } | null;
}

export const columns: ColumnDef<AppointmentWithRelations, unknown>[] = [
  {
    id: "name",
    accessorFn: (row) => row?.name || "N/A",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient Name" />
    ),
  },
  {
    id: "phone",
    accessorFn: (row) => row.phone || "N/A",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
  },
  {
    id: "date",
    accessorFn: (row) => row.date,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Appointment Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("date") as Date | null;
      if (!date) return "Not Scheduled";
      return format(date, "PPp");
    },
  },
  {
    id: "branch",
    accessorFn: (row) => row.branch?.nameEn || "N/A",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Branch" />
    ),
  },
  {
    id: "service",
    accessorFn: (row) => row.service?.titleEn || "N/A",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service Name" />
    ),
  },
  {
    id: "status",
    accessorFn: (row) => row.status,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const role = useCurrentRole();
      const router = useRouter();
      const isAdmin = role === "ADMIN" || role === "SUPERADMIN";
      const appointment = row.original;

      type AppointmentStatus =
        | "SCHEDULED"
        | "CONFIRMED"
        | "COMPLETED"
        | "CANCELLED";

      const statusColors: Record<AppointmentStatus, string> = {
        SCHEDULED: "bg-blue-500",
        CONFIRMED: "bg-green-500",
        COMPLETED: "bg-purple-500",
        CANCELLED: "bg-red-500",
      };

      const handleStatusChange = async (newStatus: AppointmentStatus) => {
        if (!isAdmin) {
          toast.error("Only administrators can change appointment status");
          return;
        }
        try {
          const result = await updateAppointment(appointment.id, {
            status: newStatus,
          });
          if (result.success) {
            toast.success("Appointment status updated successfully");
            router.refresh();
          } else {
            toast.error(result.error || "Failed to update appointment status");
          }
        } catch (error) {
          toast.error("Failed to update appointment status");
          console.error(error);
        }
      };

      const statusOptions = [
        { label: "Scheduled", value: "SCHEDULED" },
        { label: "Confirmed", value: "CONFIRMED" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Cancelled", value: "CANCELLED" },
      ];

      const [isEditing, setIsEditing] = useState(false);

      if (isEditing && isAdmin) {
        return (
          <Select
            value={status}
            onValueChange={handleStatusChange}
            open={true}
            onOpenChange={(open) => {
              if (!open) setIsEditing(false);
            }}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      return (
        <Badge
          className={`${
            statusColors[status as AppointmentStatus]
          } text-white cursor-pointer`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
      const [showDeleteDialog, setShowDeleteDialog] = useState(false);
      const [showEditDialog, setShowEditDialog] = useState(false);
      const appointment = row.original;
      const role = useCurrentRole();
      const router = useRouter();
      const isAdmin = role === "ADMIN" || role === "SUPERADMIN";

      const handleEdit = () => {
        if (!isAdmin) {
          toast.error("Only administrators can edit appointments");
          return;
        }
        setShowEditDialog(true);
      };

      const handleDelete = async () => {
        if (!isAdmin) {
          toast.error("Only administrators can delete appointments");
          return;
        }
        try {
          const result = await deleteAppointment(appointment.id);
          if (result.success) {
            toast.success("Appointment deleted successfully");
            router.refresh();
            setShowDeleteDialog(false);
          } else {
            toast.error(result.error || "Failed to delete appointment");
          }
        } catch (error) {
          toast.error("Failed to delete appointment");
          console.error(error);
        }
      };

      const handleStatusChange = async (status: string) => {
        if (!isAdmin) {
          toast.error("Only administrators can change appointment status");
          return;
        }
        try {
          const result = await updateAppointment(appointment.id, { status });
          if (result.success) {
            toast.success("Appointment status updated successfully");
            router.refresh();
          } else {
            toast.error(result.error || "Failed to update appointment status");
          }
        } catch (error) {
          toast.error("Failed to update appointment status");
          console.error(error);
        }
      };

      const actions = [
        {
          label: "Details",
          onClick: () => setIsDetailsModalOpen(true),
        },
      ];

      if (isAdmin) {
        actions.push(
          {
            label: "Edit",
            onClick: handleEdit,
          },
          {
            label: "Delete",
            onClick: () => setShowDeleteDialog(true),
          }
        );
      }

      return (
        <>
          <div className="flex items-center justify-end gap-2">
            <DataTableRowActions row={row} actions={actions} />
          </div>
          <AppointmentDetailsModal
            appointment={appointment}
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            onStatusChange={handleStatusChange}
          />
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  appointment.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {showEditDialog && (
            <EditAppointmentDialog
              appointment={appointment}
              isOpen={showEditDialog}
              onClose={() => setShowEditDialog(false)}
            />
          )}
        </>
      );
    },
  },
];
