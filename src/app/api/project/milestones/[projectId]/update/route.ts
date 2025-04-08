import { db } from "@/src/lib/database.connection";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    const { title, description, startDate, endDate, status, tasks } =
      await req.json();

    // Check if milestone exists
    const existingMilestone = await db.milestone.findUnique({
      where: { id: projectId },
    });

    if (!existingMilestone) {
      return NextResponse.json(
        { message: "Milestone not found" },
        { status: 404 }
      );
    }

    // Update milestone
    const updatedMilestone = await db.milestone.update({
      where: { id: projectId },
      data: {
        title,
        description,
        startDate,
        endDate,
        status,
        tasks: tasks
          ? {
              deleteMany: {},
              create: tasks.map(
                (task: { title: string; completed: boolean }) => ({
                  title: task.title,
                  completed: task.completed || false,
                })
              ),
            }
          : undefined,
      },
      include: {
        tasks: true,
      },
    });

    return NextResponse.json(updatedMilestone);
  } catch (error) {
    console.error("Error updating milestone:", error);
    return NextResponse.json(
      { message: "Error updating milestone" },
      { status: 500 }
    );
  }
}
