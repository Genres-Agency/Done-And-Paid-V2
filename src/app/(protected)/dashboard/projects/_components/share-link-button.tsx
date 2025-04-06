"use client";

import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";

export function ShareLinkButton() {
  const handleShareLink = () => {
    const submissionUrl = `${window.location.origin}/project-submission`;
    navigator.clipboard.writeText(submissionUrl);
    toast.success("Project submission link copied to clipboard!");
  };

  return (
    <Button onClick={handleShareLink} variant="outline">
      Share Submission Link
    </Button>
  );
}
