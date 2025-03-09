"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { fetchDashboardData } from "../data";

export function RecentInvoices() {
  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: fetchDashboardData,
  });

  const recentInvoices = dashboardData?.recentInvoices || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-green-600";
      case "PARTIALLY_PAID":
        return "text-yellow-600";
      case "PENDING":
        return "text-blue-600";
      case "OVERDUE":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {invoice.customer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {invoice.customer.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invoice.customer.email}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-medium">
                  ${invoice.total.toFixed(2)}
                </p>
                <p
                  className={`text-sm ${getStatusColor(invoice.paymentStatus)}`}
                >
                  {invoice.paymentStatus.replace("_", " ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
