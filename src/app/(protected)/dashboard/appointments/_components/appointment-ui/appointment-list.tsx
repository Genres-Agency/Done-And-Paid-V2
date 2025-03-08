"use client";

import { Heading } from "@/src/components/heading";
import { DataTable } from "../../../../_components/table/data-table";
import { Separator } from "@/src/components/ui/separator";
import PageContainer from "@/src/app/(protected)/_components/page-container";
import { Appointment } from "@prisma/client";
import { useRouter } from "next/navigation";
import { columns } from "./columns";

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

export function AppointmentList({
  appointments,
}: {
  appointments: AppointmentWithRelations[];
}) {
  const router = useRouter();
  const totalAppointments = appointments.length;

  const handleRefresh = async () => {
    router.refresh();
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Total Appointments (${totalAppointments})`}
            description="Manage all dental appointments"
          />
        </div>
        <Separator />
        <div className="relative w-full">
          <div className="overflow-x-auto">
            <DataTable
              data={appointments}
              columns={columns}
              searchKey="name"
              filterKey="status"
              filterOptions={[
                {
                  label: "Scheduled",
                  value: "SCHEDULED",
                  iconName: "calendar",
                },
                { label: "Confirmed", value: "CONFIRMED", iconName: "check" },
                {
                  label: "Completed",
                  value: "COMPLETED",
                  iconName: "checkCheck",
                },
                { label: "Cancelled", value: "CANCELLED", iconName: "x" },
              ]}
              searchPlaceholder="Search by patient name..."
              filterPlaceholder="Filter by status"
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
