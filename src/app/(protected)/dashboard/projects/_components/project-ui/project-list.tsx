import { DataTable } from "../../../../_components/table/data-table";
import { columns } from "./columns";
import { ProjectStatus } from "@prisma/client";

interface Project {
  id: string;
  title: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  budget: number | null;
  timeline: Date | null;
  requirements: string | null;
  status: ProjectStatus;
  createdAt: Date;
  assignedUser: {
    name: string | null;
  } | null;
}

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="">
      <DataTable
        columns={columns}
        data={projects}
        searchKey="clientName"
        searchPlaceholder="Search by project client name..."
      />
    </div>
  );
}
