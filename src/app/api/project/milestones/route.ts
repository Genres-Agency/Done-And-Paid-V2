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

    // Get project submission details
    const projectSubmission = await db.projectSubmission.findUnique({
      where: { id: projectId },
      include: {
        project: true,
      },
    });

    if (!projectSubmission) {
      return NextResponse.json(
        { message: "Project submission not found" },
        { status: 404 }
      );
    }

    // Check if project exists for this submission
    if (!projectSubmission.project) {
      // Create a new project for this submission
      const newProject = await db.project.create({
        data: {
          title: projectSubmission.title,
          description: projectSubmission.description,
          submissionId: projectSubmission.id,
          status: "PENDING",
        },
      });
      projectSubmission.project = newProject;
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

    let parsedResponse;
    try {
      // Clean the AI response by removing markdown formatting
      const cleanedResponse =
        aiResponse
          ?.replace(/```json\n?/g, "")
          ?.replace(/```/g, "")
          ?.trim() || '{"milestones": []}';

      // Attempt to parse the cleaned response
      parsedResponse = JSON.parse(cleanedResponse);

      // Validate the response structure
      if (
        !parsedResponse.milestones ||
        !Array.isArray(parsedResponse.milestones)
      ) {
        throw new Error("Invalid milestone format");
      }

      // Validate each milestone object
      parsedResponse.milestones.forEach((milestone: MilestoneResponse) => {
        if (
          !milestone.title ||
          !milestone.description ||
          !Array.isArray(milestone.tasks)
        ) {
          throw new Error("Invalid milestone data structure");
        }
      });
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      throw new Error("Failed to parse milestone data");
    }

    const milestones = parsedResponse.milestones;

    // Create milestones in the database
    const createdMilestones = await Promise.all(
      milestones.map(async (milestone: MilestoneResponse) => {
        const createdMilestone = await db.milestone.create({
          data: {
            title: milestone.title,
            description: milestone.description,
            tasks: milestone.tasks
              ? milestone.tasks.map((task: string) => ({
                  id: Math.random().toString(36).substr(2, 9),
                  title: task,
                  completed: false,
                }))
              : [],
            projectId: projectSubmission.project?.id || "",
            status: "PENDING",
          },
        });

        // Add the progress field required by the client
        return {
          ...createdMilestone,
          progress: 0, // Initial progress is 0 for new milestones
          tasks: ((createdMilestone.tasks as any[]) || []).map((task: any) => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
          })),
        };
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

interface MilestoneResponse {
  title: string;
  description: string;
  estimatedDuration: string;
  tasks: string[];
}

interface ParsedResponse {
  milestones: MilestoneResponse[];
}
