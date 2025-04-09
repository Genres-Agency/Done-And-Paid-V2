import { Suspense } from "react";
import { MilestoneClient } from "./milestone-client";
import MilestonesLoading from "./loading";
import { getProject } from "../../project.action";

async function getProjectDetails(projectId: string) {
  const result = await getProject(projectId);

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch project details");
  }

  return result.data;
}

export default async function ProjectMilestones({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const projectData = await getProjectDetails(projectId);

  if (!projectData) {
    throw new Error("Project data not found");
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBudget = (budget: number | null | undefined) => {
    if (!budget) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(budget);
  };

  const combinedDescription = [
    `Project Title: ${projectData.title}\n`,
    `\nDescription: ${projectData.description ?? "No description provided"}\n`,
    projectData.requirements
      ? `Additional Requirements:\n${projectData.requirements}\n`
      : "",
    `\nClient Information:\n`,
    `- Name: ${projectData.clientName}\n`,
    `- Email: ${projectData.clientEmail}\n`,
    `- Phone: ${projectData.clientPhone ?? "Not provided"}\n`,
    `\nProject Details:\n`,
    `- Budget: ${formatBudget(projectData.budget)}\n`,
    `- Timeline: ${formatDate(projectData.timeline)}\n`,
    projectData.notes ? `\nAdditional Notes:\n${projectData.notes}` : "",
  ].join("");

  return (
    <Suspense fallback={<MilestonesLoading />}>
      <MilestoneClient
        projectId={projectId}
        initialDescription={combinedDescription}
      />
    </Suspense>
  );
}
