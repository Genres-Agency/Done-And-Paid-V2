"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Badge } from "@/src/components/ui/badge";
import { format } from "date-fns";
import { Appointment } from "@prisma/client";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

interface AppointmentWithRelations extends Appointment {
  patient: {
    name: string | null;
    email: string | null;
  } | null;
  dentist: {
    name: string | null;
    email: string | null;
  } | null;
  service: {
    titleEn: string;
    price: number;
  } | null;
}

interface AppointmentDetailsModalProps {
  appointment: AppointmentWithRelations;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: string) => void;
}

const statusOptions = [
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const statusColors = {
  SCHEDULED: "bg-blue-500",
  CONFIRMED: "bg-green-500",
  COMPLETED: "bg-purple-500",
  CANCELLED: "bg-red-500",
};

export function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
  onStatusChange,
}: AppointmentDetailsModalProps) {
  const [status, setStatus] = useState(appointment.status);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as AppointmentWithRelations["status"]);
    onStatusChange(newStatus);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Patient Name:</span>
            <span className="col-span-3">{appointment?.name || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Phone:</span>
            <span className="col-span-3">{appointment.phone}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Email:</span>
            <span className="col-span-3">{appointment.email || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Service:</span>
            <span className="col-span-3">
              {appointment.service?.titleEn || "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Dentist:</span>
            <span className="col-span-3">
              {appointment.dentist?.name || "Not Assigned"}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Date:</span>
            <span className="col-span-3">
              {appointment.date
                ? format(appointment.date, "PPp")
                : "Not Scheduled"}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Address:</span>
            <span className="col-span-3">{appointment.address || "N/A"}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Notes:</span>
            <span className="col-span-3">
              {appointment.notes || "No notes"}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Status:</span>
            <div className="col-span-3">
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue>
                    <Badge className={`${statusColors[status]} text-white`}>
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).toLowerCase()}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <Badge
                        className={`${
                          statusColors[
                            option.value as keyof typeof statusColors
                          ]
                        } text-white`}
                      >
                        {option.label}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
