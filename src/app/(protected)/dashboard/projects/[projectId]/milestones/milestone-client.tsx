"use client";

import { useState } from "react";
import { Milestone } from "@/src/types/milestone";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { MilestoneManagement } from "../../_components/project-ui/milestone-management";

interface MilestoneClientProps {
  projectId: string;
  initialDescription: string;
}

export function MilestoneClient({
  projectId,
  initialDescription,
}: MilestoneClientProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const generateMilestones = async () => {
    if (!description) {
      toast.error("Please enter a project description");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/project/milestones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          projectId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate milestones");
      }

      setMilestones(data.data);
      toast.success("Milestones generated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate milestones. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const updateMilestoneStatus = async (milestone: Milestone) => {
    try {
      const response = await fetch(`/api/project/milestones/${milestone.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(milestone),
      });

      if (!response.ok) {
        throw new Error("Failed to update milestone");
      }

      setMilestones((prevMilestones) =>
        prevMilestones.map((m) => (m.id === milestone.id ? milestone : m))
      );

      toast.success("Milestone updated successfully");
    } catch (error) {
      toast.error("Failed to update milestone");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h1 className="text-3xl font-bold mb-6">Project Milestones</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generate Milestones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description to generate milestones..."
            className="min-h-[100px]"
          />
          <Button
            onClick={generateMilestones}
            disabled={isGenerating || !description}
          >
            {isGenerating ? "Generating Milestones..." : "Generate Milestones"}
          </Button>
        </CardContent>
      </Card>

      <MilestoneManagement
        initialMilestones={milestones}
        onUpdateStatus={updateMilestoneStatus}
      />
    </div>
  );
}
