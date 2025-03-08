import prisma from "@/prisma";
import { startOfMonth, subMonths } from "date-fns";

export async function fetchDashboardData() {
  // Basic counts
  const totalServices = await prisma.appointment.count();
  const totalPatients = await prisma.user.count({
    where: {
      role: "PATIENT",
    },
  });
  const totalAppointments = await prisma.appointment.count();

  // Active appointments (scheduled for next 24 hours)
  const activeAppointments = await prisma.appointment.count({
    where: {
      date: {
        gte: new Date(),
        lte: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      status: "SCHEDULED",
    },
  });

  // Monthly appointment data for the last 6 months
  const sixMonthsAgo = subMonths(startOfMonth(new Date()), 5);

  const monthlyData = await prisma.appointment.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Recent appointments
  const recentAppointments = await prisma.appointment.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      date: true,
      status: true,
      service: {
        select: {
          titleEn: true,
          media: {
            select: {
              url: true,
            },
          },
        },
      },
    },
  });

  // Growth calculations
  const lastMonthAppointments = await prisma.appointment.count({
    where: {
      createdAt: {
        gte: subMonths(new Date(), 1),
      },
    },
  });

  const previousMonthAppointments = await prisma.appointment.count({
    where: {
      createdAt: {
        gte: subMonths(new Date(), 2),
        lt: subMonths(new Date(), 1),
      },
    },
  });

  const appointmentGrowth =
    previousMonthAppointments > 0
      ? ((lastMonthAppointments - previousMonthAppointments) /
          previousMonthAppointments) *
        100
      : 0;

  const lastMonthPatients = await prisma.user.count({
    where: {
      role: "PATIENT",
      createdAt: {
        gte: subMonths(new Date(), 1),
      },
    },
  });

  const completedAppointments = await prisma.appointment.count({
    where: {
      status: "COMPLETED",
      createdAt: {
        gte: subMonths(new Date(), 1),
      },
    },
  });

  return {
    totalServices,
    totalPatients,
    totalAppointments,
    activeAppointments,
    monthlyData,
    recentAppointments,
    stats: {
      appointmentGrowth: appointmentGrowth.toFixed(1),
      patientGrowth: ((lastMonthPatients / totalPatients) * 100).toFixed(1),
      completionRate: (
        (completedAppointments / totalAppointments) *
        100
      ).toFixed(1),
    },
  };
}
