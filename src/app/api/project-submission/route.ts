import { db } from "@/src/lib/database.connection";
import { NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for project submission
const projectSubmissionSchema = z.object({
  title: z.string().min(2, {
    message: "Project title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Project description must be at least 10 characters.",
  }),
  clientName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  clientEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  clientPhone: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.date().optional(),
  requirements: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validatedData = projectSubmissionSchema.parse(body);

    // Convert budget to float if provided
    const budget = validatedData.budget
      ? parseFloat(validatedData.budget)
      : null;

    // Create the project submission
    const projectSubmission = await db.projectSubmission.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        clientName: validatedData.clientName,
        clientEmail: validatedData.clientEmail,
        clientPhone: validatedData.clientPhone,
        budget: budget,
        timeline: validatedData.timeline,
        requirements: validatedData.requirements,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Project submitted successfully", data: projectSubmission },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Project submission error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
