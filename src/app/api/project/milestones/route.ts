import { db } from "@/src/lib/database.connection";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a project management assistant. Analyze the project description and break it down into milestones with estimated timelines and tasks.
Provide the response in the following JSON format:
{
  "milestones": [{
    "title": string,
    "description": string,
    "estimatedDuration": string (e.g., "1 week", "2 days"),
    "tasks": string[] (list of specific tasks for this milestone)
  }]
}`;

export async function POST(req: Request) {
  try {
    const { projectId, description } = await req.json();

    if (!projectId || !description) {
      return NextResponse.json(
        { message: "Project ID and description are required" },
        { status: 400 }
      );
    }

    // Get project details
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Generate milestones using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Break down this project description into milestones with estimated timelines and tasks: ${description}`,
        },
      ],
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    const milestones = JSON.parse(aiResponse).milestones;

    // Create milestones in the database
    const createdMilestones = await Promise.all(
      milestones.map(async (milestone: any) => {
        return await db.milestone.create({
          data: {
            title: milestone.title,
            description: milestone.description,
            tasks: milestone.tasks,
            projectId: projectId,
            status: "PENDING",
          },
        });
      })
    );

    return NextResponse.json(
      {
        message: "Milestones generated successfully",
        data: createdMilestones,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating milestones:", error);
    return NextResponse.json(
      { message: "Error generating milestones" },
      { status: 500 }
    );
  }
}
