import { db } from "@/src/lib/database.connection";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await db.projectSubmission.findMany({
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
        project: {
          include: {
            milestones: {
              select: {
                id: true,
                title: true,
                description: true,
                startDate: true,
                endDate: true,
                status: true,
                tasks: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        milestones: true,
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
        status: "PENDING",
        project: {
          create: {
            title,
            description,
            status: "PENDING",
            startDate: timeline ? new Date(timeline) : null,
          },
        },
      },
      include: {
        project: {
          include: {
            milestones: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
