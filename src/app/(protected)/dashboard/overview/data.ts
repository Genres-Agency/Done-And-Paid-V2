import prisma from "@/prisma";
import { startOfMonth, subMonths, endOfMonth } from "date-fns";

export async function fetchDashboardData() {
  // Basic counts with proper null handling
  const totalInvoices = await prisma.invoice.count();
  const totalCustomers = await prisma.user.count({
    where: {
      role: "USER",
    },
  });
  const totalRevenue = await prisma.invoice.aggregate({
    _sum: {
      total: true,
    },
    where: {
      paymentStatus: "PAID",
    },
  });

  // Active invoices (pending payment)
  const pendingInvoices = await prisma.invoice.count({
    where: {
      paymentStatus: "PENDING",
    },
  });

  // Monthly invoice data with proper date range filtering
  const now = new Date();
  const sixMonthsAgo = startOfMonth(subMonths(now, 5));
  const currentMonthEnd = endOfMonth(now);

  const monthlyData = await prisma.invoice.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    _sum: {
      total: true,
    },
    where: {
      createdAt: {
        gte: sixMonthsAgo,
        lte: currentMonthEnd,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Recent invoices with proper customer relationship
  const recentInvoices = await prisma.invoice.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  // Growth calculations with null safety
  const currentMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const previousMonthStart = startOfMonth(subMonths(now, 2));

  const lastMonthInvoices = await prisma.invoice.aggregate({
    _sum: {
      total: true,
    },
    where: {
      createdAt: {
        gte: lastMonthStart,
        lt: currentMonthStart,
      },
      paymentStatus: "PAID",
    },
  });

  const previousMonthInvoices = await prisma.invoice.aggregate({
    _sum: {
      total: true,
    },
    where: {
      createdAt: {
        gte: previousMonthStart,
        lt: lastMonthStart,
      },
      paymentStatus: "PAID",
    },
  });

  const lastMonthAmount = lastMonthInvoices._sum?.total || 0;
  const previousMonthAmount = previousMonthInvoices._sum?.total || 0;

  const revenueGrowth =
    previousMonthAmount > 0
      ? ((lastMonthAmount - previousMonthAmount) / previousMonthAmount) * 100
      : 0;

  const lastMonthCustomers = await prisma.user.count({
    where: {
      role: "USER",
      createdAt: {
        gte: lastMonthStart,
        lt: currentMonthStart,
      },
    },
  });

  const paidInvoices = await prisma.invoice.count({
    where: {
      paymentStatus: "PAID",
      createdAt: {
        gte: lastMonthStart,
        lt: currentMonthStart,
      },
    },
  });

  return {
    totalInvoices,
    totalCustomers,
    totalRevenue: totalRevenue._sum?.total || 0,
    pendingInvoices,
    monthlyData: monthlyData.map((data) => ({
      ...data,
      _sum: { total: data._sum?.total || 0 },
    })),
    recentInvoices,
    stats: {
      revenueGrowth: Number(revenueGrowth.toFixed(1)),
      customerGrowth: Number(
        ((lastMonthCustomers / (totalCustomers || 1)) * 100).toFixed(1)
      ),
      paymentRate: Number(
        ((paidInvoices / (totalInvoices || 1)) * 100).toFixed(1)
      ),
    },
  };
}
