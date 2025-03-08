import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface LoadingErrorProps {
  message?: string;
  retry?: () => void;
}

export function LoadingError({ message, retry }: LoadingErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center gap-4">
        {message || "Failed to load data. Please try again."}
        {retry && (
          <button
            onClick={retry}
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Retry
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
