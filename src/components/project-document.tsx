"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatDate } from "@/src/lib/utils";

interface ProjectDocumentProps {
  projectData: {
    title: string;
    description: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    budget?: number;
    timeline?: Date;
    requirements?: string;
  };
}

export function ProjectDocument({ projectData }: ProjectDocumentProps) {
  const {
    title,
    description,
    clientName,
    clientEmail,
    clientPhone,
    budget,
    timeline,
    requirements,
  } = projectData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Project Title</h3>
            <p>{title}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Project Description</h3>
            <p className="whitespace-pre-wrap">{description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2">Client Name</h3>
            <p>{clientName}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contact Information</h3>
            <p>Email: {clientEmail}</p>
            {clientPhone && <p>Phone: {clientPhone}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2">Budget</h3>
            <p>
              {budget
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(budget)
                : "Not specified"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Timeline</h3>
            <p>{timeline ? formatDate(timeline) : "Not specified"}</p>
          </div>
        </CardContent>
      </Card>

      {requirements && (
        <Card>
          <CardHeader>
            <CardTitle>Project Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{requirements}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
