import React, { Suspense } from "react";
import { Metadata } from "next";
import { LoadingPage } from "@/src/components/loading";
import { ProjectList } from "./_components/project-ui/project-list";
import { getProjects, getProjectStats } from "./project.action";
import PageContainer from "../../_components/page-container";
import { ProjectStats } from "./_components/project-ui/project-stats";

export const metadata: Metadata = {
  title: "Projects | Done & Paid",
  description: "Manage all your projects in one place",
};

export default async function ProjectsPage() {
  try {
    const [projects, stats] = await Promise.all([
      getProjects(),
      getProjectStats(),
    ]);
    // console.log("======>>>>", projects);
    return (
      <PageContainer>
        <Suspense fallback={<LoadingPage />}>
          <div className="overflow-x-auto">
            <ProjectList projects={projects} />
          </div>
        </Suspense>
      </PageContainer>
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">
            Failed to fetch projects. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
