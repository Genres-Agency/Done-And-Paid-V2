"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Progress } from "@/src/components/ui/progress";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  tasks: Task[];
  progress: number;
}

export function MilestoneManagement({
  initialMilestones = [],
  onUpdateStatus,
}: {
  initialMilestones?: Milestone[];
  onUpdateStatus?: (milestone: Milestone) => Promise<void>;
}) {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);

  const updateMilestoneStatus = async (milestoneId: string, status: string) => {
    try {
      const milestone = milestones.find((m) => m.id === milestoneId);
      if (!milestone) return;

      const updatedMilestone = {
        ...milestone,
        status: status as Milestone["status"],
      };

      if (onUpdateStatus) {
        await onUpdateStatus(updatedMilestone);
      }

      setMilestones((prev) =>
        prev.map((m) => (m.id === milestoneId ? updatedMilestone : m))
      );
    } catch (error) {
      toast.error("Failed to update milestone status");
    }
  };

  const updateTaskStatus = async (milestoneId: string, taskId: string) => {
    try {
      setMilestones((prev) =>
        prev.map((m) => {
          if (m.id === milestoneId) {
            const updatedTasks = m.tasks.map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            );
            const completedTasks = updatedTasks.filter(
              (t) => t.completed
            ).length;
            const progress = (completedTasks / updatedTasks.length) * 100;
            return { ...m, tasks: updatedTasks, progress };
          }
          return m;
        })
      );
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <Card key={milestone.id} className="relative">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{milestone.title}</CardTitle>
              <Select
                value={milestone.status}
                onValueChange={(value) =>
                  updateMilestoneStatus(milestone.id, value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {milestone.description}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Progress value={milestone.progress} className="flex-1" />
                <span className="text-sm font-medium">
                  {milestone.progress.toFixed(0)}%
                </span>
              </div>
              <div className="space-y-2">
                {milestone.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => updateTaskStatus(milestone.id, task.id)}
                      className="h-4 w-4"
                    />
                    <span
                      className={`flex-1 text-sm ${
                        task.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
