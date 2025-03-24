"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Activity,
  CheckCircle2,
  Clock,
  DollarSign,
  UserCheck,
  Users2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProjectStats } from "../../project.action";

interface ProjectStats {
  total: number;
  pending: number;
  completed: number;
  inProgress: number;
  cancelled: number;
  averageCompletionTime?: number;
  totalBudget?: number;
}

type ProjectStatsProps = {
  mode?: "simple" | "detailed";
  stats?: ProjectStats;
};

export function ProjectStats({
  mode = "detailed",
  stats: propStats,
}: ProjectStatsProps) {
  const { data: queryStats } = useQuery({
    queryKey: ["project-stats"],
    queryFn: getProjectStats,
    enabled: !propStats,
  });

  const stats: ProjectStats = propStats ||
    queryStats || {
      total: 0,
      pending: 0,
      completed: 0,
      inProgress: 0,
      cancelled: 0,
      averageCompletionTime: undefined,
      totalBudget: undefined,
    };
  const detailedItems = [
    {
      label: "Total Projects",
      value: stats?.total || 0,
      className: "bg-gray-100",
      icon: Users2,
    },
    {
      label: "Pending",
      value: stats.pending,
      className: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      className: "bg-purple-100 text-purple-800",
      icon: Activity,
    },
    {
      label: "Completed",
      value: stats.completed,
      className: "bg-green-100 text-green-800",
      icon: CheckCircle2,
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      className: "bg-red-100 text-red-800",
      icon: XCircle,
    },
  ];

  const simpleItems = [
    {
      title: "Total Projects",
      value: stats?.total || 0,
      icon: Users2,
    },
    {
      title: "Completed",
      value: stats?.completed || 0,
      icon: CheckCircle2,
    },
    {
      title: "Pending",
      value: stats?.pending || 0,
      icon: Clock,
    },
    {
      title: "In Progress",
      value: stats?.inProgress || 0,
      icon: Activity,
    },
  ];

  if (mode === "simple") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {simpleItems.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {detailedItems.map((item) => (
            <div
              key={item.label}
              className={`${item.className} p-4 rounded-lg`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{item.label}</span>
                {item.icon && <item.icon className="h-4 w-4" />}
              </div>
              <div className="text-2xl font-bold">{item.value || 0}</div>
            </div>
          ))}
        </div>
        {(stats.averageCompletionTime || stats.totalBudget) && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {stats.averageCompletionTime && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Average Completion Time
                    </span>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold mt-2">
                    {stats.averageCompletionTime} days
                  </div>
                </CardContent>
              </Card>
            )}
            {stats.totalBudget && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Budget</span>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold mt-2">
                    ${stats.totalBudget.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
