"use server";

import { db } from "@/src/lib/database.connection";
import { ProjectStatus } from "@prisma/client";

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
