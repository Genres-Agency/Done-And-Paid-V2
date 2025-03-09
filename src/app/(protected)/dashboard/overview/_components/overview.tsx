"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  LineChart,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { format, startOfMonth } from "date-fns";

interface MonthlyData {
  createdAt: Date;
  _count: {
    id: number;
  };
  _sum: {
    amount: number;
  };
}

export function Overview({ monthlyData }: { monthlyData: MonthlyData[] }) {
  // Transform the data for charts - group by month
  const chartData = monthlyData.reduce((acc: any[], item) => {
    const monthDate = startOfMonth(new Date(item.createdAt));
    const monthKey = format(monthDate, "MMM");

    const existingMonth = acc.find((d) => d.name === monthKey);
    if (existingMonth) {
      existingMonth.invoices += item._count.id;
      existingMonth.revenue += item._sum.amount || 0;
    } else {
      acc.push({
        name: monthKey,
        invoices: item._count.id,
        revenue: item._sum.amount || 0,
      });
    }
    return acc;
  }, []);

  return (
    <Tabs defaultValue="bar" className="space-y-4">
      <TabsList>
        <TabsTrigger value="bar">Bar Chart</TabsTrigger>
        <TabsTrigger value="line">Line Chart</TabsTrigger>
        <TabsTrigger value="area">Area Chart</TabsTrigger>
      </TabsList>
      <TabsContent value="bar" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Bar
                  dataKey="invoices"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                  name="Total Invoices"
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="line" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="invoices"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  name="Total Invoices"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="area" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="invoices"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.2}
                  name="Total Invoices"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.2}
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
