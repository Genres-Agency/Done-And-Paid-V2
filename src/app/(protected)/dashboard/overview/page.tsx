import { Metadata } from "next";
import { Overview } from "./_components/overview";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { DateRangePicker } from "./_components/date-range-picker";
import { Calendar, Users2, Activity, Clock } from "lucide-react";
import { fetchDashboardData } from "./data";
import { RecentInvoices } from "./_components/recent-invoice";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function DashboardPage() {
  const {
    totalInvoices,
    totalCustomers,
    totalRevenue,
    pendingInvoices,
    monthlyData,
    stats,
  } = await fetchDashboardData();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <DateRangePicker />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Invoices
            </CardTitle>
            <Calendar className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalInvoices}</div>
            <p className="text-xs text-blue-100">
              +{stats.paymentRate}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Customers
            </CardTitle>
            <Users2 className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalCustomers}
            </div>
            <p className="text-xs text-purple-100">
              +{stats.customerGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Revenue
            </CardTitle>
            <Activity className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalRevenue}</div>
            <p className="text-xs text-amber-100">
              +{stats.revenueGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Pending Invoices
            </CardTitle>
            <Clock className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {pendingInvoices}
            </div>
            <p className="text-xs text-green-100">Awaiting payment</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview
              monthlyData={monthlyData.map((data) => ({
                ...data,
                _sum: {
                  amount: data._sum.total,
                },
              }))}
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentInvoices />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
