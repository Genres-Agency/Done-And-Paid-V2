import { Metadata } from "next";
import { AppointmentList } from "./_components/appointment-ui/appointment-list";
import { fetchAppointments } from "./data";

export const metadata: Metadata = {
  title: "Appointments",
  description: "Manage dental appointments",
};

export default async function AppointmentsPage() {
  const appointments = await fetchAppointments();

  return <AppointmentList appointments={appointments} />;
}
