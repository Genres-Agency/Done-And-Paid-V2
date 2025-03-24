"use server";

import { db } from "@/src/lib/database.connection";
import { ProjectStatus } from "@prisma/client";

export async function createProject(data: {
  title: string;
  description: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  budget?: number;
  timeline?: Date;
  requirements?: string;
}) {
  try {
    const project = await db.projectSubmission.create({
      data: {
        ...data,
        status: "PENDING",
      },
    });
    return { success: true, data: project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(
  projectId: string,
  data: {
    title?: string;
    description?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    budget?: number;
    timeline?: Date;
    requirements?: string;
  }
) {
  try {
    const project = await db.projectSubmission.update({
      where: { id: projectId },
      data,
    });
    return { success: true, data: project };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(projectId: string) {
  try {
    await db.projectSubmission.delete({
      where: { id: projectId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

export async function getProject(projectId: string) {
  try {
    const project = await db.projectSubmission.findUnique({
      where: { id: projectId },
      include: {
        assignedUser: true,
        milestones: true,
      },
    });
    if (!project) {
      return { success: false, error: "Project not found" };
    }
    return { success: true, data: project };
  } catch (error) {
    console.error("Error fetching project:", error);
    return { success: false, error: "Failed to fetch project" };
  }
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus
) {
  try {
    const updatedProject = await db.projectSubmission.update({
      where: { id: projectId },
      data: { status },
    });
    return { success: true, data: updatedProject };
  } catch (error) {
    console.error("Error updating project status:", error);
    return { success: false, error: "Failed to update project status" };
  }
}

export async function getProjectStats() {
  const projects = await db.projectSubmission.findMany({
    include: {
      assignedUser: true,
      milestones: true,
    },
  });

  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (project) => project.status === "COMPLETED"
  ).length;
  const pendingProjects = projects.filter(
    (project) => project.status === "PENDING"
  ).length;
  const assignedProjects = projects.filter(
    (project) => project.assignedUserId
  ).length;

  return {
    totalProjects,
    completedProjects,
    pendingProjects,
    assignedProjects,
  };
}

export async function assignProjectToUser(projectId: string, userId: string) {
  try {
    const updatedProject = await db.projectSubmission.update({
      where: { id: projectId },
      data: { assignedUserId: userId },
    });
    return { success: true, data: updatedProject };
  } catch (error) {
    console.error("Error assigning project:", error);
    return { success: false, error: "Failed to assign project" };
  }
}
