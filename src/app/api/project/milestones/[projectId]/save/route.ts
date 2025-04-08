import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma";

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { milestones } = await req.json();
    if (!milestones || !Array.isArray(milestones)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid milestones data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const projectId = params.projectId;
    if (!projectId) {
      return new NextResponse(
        JSON.stringify({ message: "Project ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        submission: {
          select: {
            assignedUserId: true,
          },
        },
      },
    });

    if (!project) {
      return new NextResponse(
        JSON.stringify({ message: "Project not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (project.submission.assignedUserId !== session.user.id) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update or create milestones
    for (const milestone of milestones) {
      await prisma.milestone.upsert({
        where: { id: milestone.id },
        update: {
          title: milestone.title,
          description: milestone.description,
          status: milestone.status,
          tasks: {
            deleteMany: {},
            create: milestone.tasks.map((task: any) => ({
              title: task.title,
              completed: task.completed,
            })),
          },
        },
        create: {
          id: milestone.id,
          title: milestone.title,
          description: milestone.description,
          status: milestone.status,
          projectId: projectId,
          tasks: {
            create: milestone.tasks.map((task: any) => ({
              title: task.title,
              completed: task.completed,
            })),
          },
        },
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: "Milestones saved successfully",
        data: milestones,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error saving milestones:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error saving milestones" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
