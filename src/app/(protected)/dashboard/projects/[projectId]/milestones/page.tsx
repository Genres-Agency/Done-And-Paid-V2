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
  params: { projectId: string };
}) {
  const projectData = await getProjectDetails(params.projectId);

  if (!projectData) {
    throw new Error("Project data not found");
  }

  const combinedDescription = [
    projectData.description ?? "",
    projectData.requirements
      ? `\n\nRequirements:\n${projectData.requirements}`
      : "",
  ].join("");

  return (
    <Suspense fallback={<MilestonesLoading />}>
      <MilestoneClient
        projectId={params.projectId}
        initialDescription={combinedDescription}
      />
    </Suspense>
  );
}
