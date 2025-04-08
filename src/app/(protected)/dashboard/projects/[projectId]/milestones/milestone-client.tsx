"use client";

import { useEffect, useState } from "react";
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
  const [generatedMilestones, setGeneratedMilestones] = useState<Milestone[]>(
    []
  );
  const [showGenerateUI, setShowGenerateUI] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSavedMilestones = async () => {
      try {
        const response = await fetch(`/api/project/milestones/${projectId}`);
        const data = await response.json();

        if (response.ok && data.data.length > 0) {
          setMilestones(data.data);
          setShowGenerateUI(false);
        }
      } catch (error) {
        console.error("Error fetching saved milestones:", error);
      }
    };

    fetchSavedMilestones();
  }, [projectId]);

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

      setGeneratedMilestones(data.data);
      setMilestones(data.data);
      setShowGenerateUI(false);
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

  const saveMilestones = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/project/milestones/${projectId}/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            milestones: milestones,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save milestones");
      }

      toast.success("Milestones saved successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save milestones. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    setShowGenerateUI(true);
    setMilestones([]);
    setGeneratedMilestones([]);
  };

  const updateMilestoneStatus = async (milestone: Milestone) => {
    try {
      const response = await fetch(
        `/api/project/milestones/${projectId}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(milestone),
        }
      );

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

      {showGenerateUI ? (
        <Card>
          <CardHeader>
            <CardTitle>Generate Milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description to generate milestones..."
                className="min-h-[100px]"
                disabled={isGenerating}
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
            <Button
              onClick={generateMilestones}
              disabled={isGenerating || !description}
              className="w-full sm:w-auto"
            >
              {isGenerating
                ? "Generating Milestones..."
                : "Generate Milestones"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <MilestoneManagement
            initialMilestones={milestones}
            onUpdateStatus={updateMilestoneStatus}
          />
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={isSaving}
            >
              Regenerate
            </Button>
            <Button onClick={saveMilestones} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
