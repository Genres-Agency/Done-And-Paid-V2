import { db } from "@/src/lib/database.connection";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;

    const project = await db.project.findUnique({
      where: { submissionId: projectId },
      include: {
        milestones: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    const formattedMilestones = project.milestones.map((milestone) => {
      const completedTasks = milestone.tasks.filter(
        (task) => task.completed
      ).length;
      const progress =
        milestone.tasks.length > 0
          ? (completedTasks / milestone.tasks.length) * 100
          : 0;

      return {
        id: milestone.id,
        title: milestone.title,
        description: milestone.description || "",
        status: milestone.status,
        tasks: milestone.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
        })),
        progress,
      };
    });

    return NextResponse.json({ data: formattedMilestones });
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return NextResponse.json(
      { message: "Error fetching milestones" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    const milestone = await req.json();

    const updatedMilestone = await db.milestone.update({
      where: { id: milestone.id },
      data: {
        status: milestone.status,
        tasks: {
          updateMany: milestone.tasks.map(
            (task: { id: string; completed: boolean }) => ({
              where: { id: task.id },
              data: { completed: task.completed },
            })
          ),
        },
      },
      include: {
        tasks: true,
      },
    });

    const completedTasks = updatedMilestone.tasks.filter(
      (task) => task.completed
    ).length;
    const progress =
      updatedMilestone.tasks.length > 0
        ? (completedTasks / updatedMilestone.tasks.length) * 100
        : 0;

    return NextResponse.json({
      data: {
        ...updatedMilestone,
        progress,
      },
    });
  } catch (error) {
    console.error("Error updating milestone:", error);
    return NextResponse.json(
      { message: "Error updating milestone" },
      { status: 500 }
    );
  }
}
