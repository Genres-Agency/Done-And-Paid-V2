import { Metadata } from "next";
import { getProjects } from "./project.action";

export const metadata: Metadata = {
  title: "Projects | Done & Paid",
  description: "Manage all your projects in one place",
};

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getProjects();
  return children;
}
