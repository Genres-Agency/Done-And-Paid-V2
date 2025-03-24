import { db } from "@/src/lib/database.connection";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, milestoneId } = body;

    const task = await db.task.create({
      data: {
        title,
        completed: false,
        milestoneId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, completed } = body;

    const task = await db.task.update({
      where: { id },
      data: { completed },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
