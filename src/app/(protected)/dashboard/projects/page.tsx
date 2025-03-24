import { DataTable } from "../../_components/table/data-table";
import { columns } from "./_components/columns";
import { db } from "@/src/lib/database.connection";
import { ProjectStats } from "./_components/project-stats";

export const dynamic = "force-dynamic";

async function getProjects() {
  try {
    const projects = await db.projectSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        assignedUser: true,
      },
    });

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
      </div>
      <ProjectStats />
      <DataTable columns={columns} data={projects} searchKey="clientName" />
    </div>
  );
}
