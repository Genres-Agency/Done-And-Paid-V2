import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/src/lib/database.connection";
import { format } from "date-fns";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { ProjectStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { updateProjectStatus } from "./project-actions";

const statusColorMap: Record<ProjectStatus, string> = {
  PENDING: "bg-yellow-500",
  APPROVED: "bg-blue-500",
  IN_PROGRESS: "bg-purple-500",
  COMPLETED: "bg-green-500",
  CANCELLED: "bg-red-500",
};

async function getProject(projectId: string) {
  try {
    const project = await db.projectSubmission.findUnique({
      where: { id: projectId },
      include: {
        assignedUser: true,
      },
    });

    if (!project) return null;

    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await getProject(params.projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{project.title}</h2>
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/projects/${params.projectId}/edit`}>
            <Button variant="outline">Edit Project</Button>
          </Link>
          <Link href={`/dashboard/projects/${params.projectId}/milestones`}>
            <Button variant="outline">Generate Milestones</Button>
          </Link>
          <form
            action={async (formData: FormData) => {
              "use server";
              const status = formData.get("status") as ProjectStatus;
              await updateProjectStatus(params.projectId, status);
            }}
          >
            <Select name="status" defaultValue={project.status}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ProjectStatus).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    <Badge
                      className={`${
                        statusColorMap[value as ProjectStatus]
                      } text-white`}
                    >
                      {value.replace("_", " ")}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-semibold">Name:</span> {project.clientName}
            </div>
            <div>
              <span className="font-semibold">Email:</span>{" "}
              {project.clientEmail}
            </div>
            {project.clientPhone && (
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {project.clientPhone}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {project.budget && (
              <div>
                <span className="font-semibold">Budget:</span>{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(project.budget)}
              </div>
            )}
            {project.timeline && (
              <div>
                <span className="font-semibold">Timeline:</span>{" "}
                {format(new Date(project.timeline), "MMM dd, yyyy")}
              </div>
            )}
            <div>
              <span className="font-semibold">Assigned To:</span>{" "}
              {project.assignedUser?.name || "Not assigned"}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Project Description</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap">
            {project.description}
          </CardContent>
        </Card>

        {project.requirements && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap">
              {project.requirements}
            </CardContent>
          </Card>
        )}

        {project.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap">
              {project.notes}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
