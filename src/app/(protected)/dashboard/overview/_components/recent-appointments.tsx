"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";

// Mock function to get appointments - replace with actual API call
const getRecentAppointments = async () => {
  // This should be replaced with actual API call
  return [
    {
      id: 1,
      patientName: "John Doe",
      patientEmail: "john@example.com",
      patientImage: "/avatars/john.jpg",
      service: "Dental Cleaning",
      appointmentTime: new Date(2024, 2, 28, 10, 30),
      status: "scheduled",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      patientEmail: "jane@example.com",
      patientImage: "/avatars/jane.jpg",
      service: "Root Canal",
      appointmentTime: new Date(2024, 2, 28, 14, 0),
      status: "confirmed",
    },
    {
      id: 3,
      patientName: "Mike Johnson",
      patientEmail: "mike@example.com",
      patientImage: null,
      service: "Teeth Whitening",
      appointmentTime: new Date(2024, 2, 29, 11, 0),
      status: "scheduled",
    },
    {
      id: 4,
      patientName: "Sarah Wilson",
      patientEmail: "sarah@example.com",
      patientImage: "/avatars/sarah.jpg",
      service: "Dental Checkup",
      appointmentTime: new Date(2024, 2, 29, 15, 30),
      status: "confirmed",
    },
  ];
};

export function RecentAppointments() {
  const { data: appointments } = useQuery({
    queryKey: ["recent-appointments"],
    queryFn: getRecentAppointments,
  });

  const recentAppointments = appointments?.slice(0, 4) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={appointment.patientImage || ""}
                  alt={appointment.patientName}
                />
                <AvatarFallback>
                  {appointment.patientName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {appointment.patientName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {appointment.service}
                </p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                {format(appointment.appointmentTime, "PPp")}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
