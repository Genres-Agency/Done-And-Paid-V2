"use client";

import React from "react";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[450px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-4xl">⚠️</span>
            <h2 className="text-2xl font-bold tracking-tight">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground">
              {this.state.error?.message ||
                "An unexpected error occurred. Please try again."}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false })}
            className="gap-2"
          >
            <RefreshCcw size={16} />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
