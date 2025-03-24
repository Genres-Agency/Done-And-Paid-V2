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
import { Button } from "@/src/components/ui/button";
import { ProjectStatus } from "@prisma/client";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  assignedUserId: string | null;
}

export function ProjectManagement({
  project,
  onUpdateStatus,
  onAssignUser,
}: {
  project: Project;
  onUpdateStatus?: (status: ProjectStatus) => Promise<void>;
  onAssignUser?: (userId: string) => Promise<void>;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProjectStatus = async (status: ProjectStatus) => {
    if (!onUpdateStatus) return;
    setIsUpdating(true);

    try {
      await onUpdateStatus(status);
      toast.success("Project status updated successfully");
    } catch (error) {
      toast.error("Failed to update project status");
    } finally {
      setIsUpdating(false);
    }
  };

  const assignProjectToUser = async (userId: string) => {
    if (!onAssignUser) return;
    setIsUpdating(true);

    try {
      await onAssignUser(userId);
      toast.success("Project assigned successfully");
    } catch (error) {
      toast.error("Failed to assign project");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Project Status</h3>
          <Select
            value={project.status}
            onValueChange={(value) =>
              updateProjectStatus(value as ProjectStatus)
            }
            disabled={isUpdating}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Assign Project</h3>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => assignProjectToUser("user-id")}
            disabled={isUpdating}
          >
            {project.assignedUserId ? "Reassign Project" : "Assign Project"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
