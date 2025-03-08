"use server";
import prisma from "@/prisma";

export async function fetchAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        dentist: true,
        service: true,
        branch: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

export async function getAppointmentById(id: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        dentist: true,
        service: true,
        branch: true,
      },
    });

    return appointment;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return null;
  }
}

export async function updateAppointment(id: string, data: any) {
  try {
    if (!id) {
      return { success: false, error: "Appointment ID is required" };
    }
    if (!data || Object.keys(data).length === 0) {
      return {
        success: false,
        error: "Update data is required and cannot be empty",
      };
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return { success: false, error: "Appointment not found" };
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: true,
        dentist: true,
        service: true,
        branch: true,
      },
    });

    if (!updatedAppointment) {
      return { success: false, error: "Failed to update appointment" };
    }

    return { success: true, data: updatedAppointment };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update appointment",
    };
  }
}

export async function deleteAppointment(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Appointment ID is required" };
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return { success: false, error: "Appointment not found" };
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return { success: true, message: "Appointment deleted successfully" };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete appointment",
    };
  }
}
