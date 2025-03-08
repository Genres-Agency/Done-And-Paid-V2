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
import { format, parseISO, startOfMonth } from "date-fns";

interface MonthlyData {
  createdAt: Date;
  _count: {
    id: number;
  };
}

export function Overview({ monthlyData }: { monthlyData: MonthlyData[] }) {
  // Transform the data for charts - group by month
  const chartData = monthlyData.reduce((acc: any[], item) => {
    const monthDate = startOfMonth(new Date(item.createdAt));
    const monthKey = format(monthDate, "MMM");

    const existingMonth = acc.find((d) => d.name === monthKey);
    if (existingMonth) {
      existingMonth.total += item._count.id;
      existingMonth.articles += item._count.id;
    } else {
      acc.push({
        name: monthKey,
        total: item._count.id,
        articles: item._count.id,
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
            <CardTitle>Appointment Trends</CardTitle>
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
                  dataKey="total"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                  name="Total Appointments"
                />
                <Bar
                  dataKey="articles"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                  name="Completed Appointments"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="line" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Service Growth</CardTitle>
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
                  dataKey="total"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  name="Total Appointments"
                />
                <Line
                  type="monotone"
                  dataKey="articles"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  name="Completed Appointments"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="area" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Distribution</CardTitle>
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
                  dataKey="total"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.2}
                  name="Total Appointments"
                />
                <Area
                  type="monotone"
                  dataKey="articles"
                  stackId="1"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.2}
                  name="Completed Appointments"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
