import { db } from "@/src/lib/database.connection";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await db.projectSubmission.findMany({
      include: {
        assignedUser: true,
        project: {
          include: {
            milestones: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      clientName,
      clientEmail,
      clientPhone,
      budget,
      timeline,
      requirements,
    } = body;

    const project = await db.projectSubmission.create({
      data: {
        title,
        description,
        clientName,
        clientEmail,
        clientPhone,
        budget: budget ? parseFloat(budget) : null,
        timeline: timeline ? new Date(timeline) : null,
        requirements,
        project: {
          create: {
            title,
            description,
            status: "PENDING",
          },
        },
      },
      include: {
        project: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
