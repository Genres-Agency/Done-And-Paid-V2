"use client";

import { useEffect } from "react";
import { RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-background">
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full bg-destructive/10 p-4">
          <div className="rounded-full bg-destructive/20 p-3">
            <div className="rounded-full bg-destructive/30 p-2">
              <span className="text-6xl">⚠️</span>
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Something went wrong!
        </h1>
        <p className="text-muted-foreground text-center max-w-[500px]">
          {error.message ||
            "An unexpected error occurred. Please try again later."}
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={reset} variant="outline" className="gap-2">
          <RefreshCcw size={16} />
          Try again
        </Button>
        <Button asChild>
          <Link href="/" className="gap-2">
            <Home size={16} />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
