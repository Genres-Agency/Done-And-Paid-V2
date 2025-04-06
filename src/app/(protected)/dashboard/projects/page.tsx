import React, { Suspense } from "react";
import { LoadingPage } from "@/src/components/loading";
import { ProjectList } from "./_components/project-ui/project-list";
import PageContainer from "../../_components/page-container";
import { getProjects } from "./project.action";
import { ShareLinkButton } from "./_components/share-link-button";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <ShareLinkButton />
      </div>
      <Suspense fallback={<LoadingPage />}>
        <div className="overflow-x-auto">
          <ProjectList projects={projects} />
        </div>
      </Suspense>
    </PageContainer>
  );
}
