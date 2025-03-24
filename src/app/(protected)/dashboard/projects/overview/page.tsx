import React from "react";
import { ProjectStats } from "../_components/project-ui/project-stats";
import PageContainer from "../../../_components/page-container";

export const metadata = {
  title: "Project Overview | Done & Paid",
  description: "Comprehensive overview of all projects and their statistics",
};

export default async function ProjectOverviewPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">Project Overview</h2>
        <ProjectStats mode="detailed" />
      </div>
    </PageContainer>
  );
}
