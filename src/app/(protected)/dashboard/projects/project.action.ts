"use server";

import prisma from "@/prisma";
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
    const project = await prisma.projectSubmission.create({
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
    const project = await prisma.projectSubmission.update({
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
    await prisma.projectSubmission.delete({
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
    const project = await prisma.projectSubmission.findUnique({
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
    const updatedProject = await prisma.projectSubmission.update({
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
  const projects = await prisma.projectSubmission.findMany({
    include: {
      assignedUser: true,
      milestones: true,
    },
  });

  const total = projects.length;
  const completed = projects.filter(
    (project) => project.status === "COMPLETED"
  ).length;
  const pending = projects.filter(
    (project) => project.status === "PENDING"
  ).length;
  const inProgress = projects.filter(
    (project) => project.status === "IN_PROGRESS"
  ).length;
  const cancelled = projects.filter(
    (project) => project.status === "CANCELLED"
  ).length;

  return {
    total,
    completed,
    pending,
    inProgress,
    cancelled,
  };
}

export async function assignProjectToUser(projectId: string, userId: string) {
  try {
    const updatedProject = await prisma.projectSubmission.update({
      where: { id: projectId },
      data: { assignedUserId: userId },
    });
    return { success: true, data: updatedProject };
  } catch (error) {
    console.error("Error assigning project:", error);
    return { success: false, error: "Failed to assign project" };
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.projectSubmission.findMany({
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        milestones: {
          orderBy: {
            endDate: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      clientName: project.clientName,
      clientEmail: project.clientEmail,
      clientPhone: project.clientPhone,
      budget: project.budget,
      timeline: project.timeline,
      requirements: project.requirements,
      status: project.status,
      createdAt: project.createdAt,
      assignedUser: project.assignedUser,
      milestones: project.milestones,
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}
