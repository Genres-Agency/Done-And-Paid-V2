import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-background">
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full bg-muted p-4">
          <div className="rounded-full bg-muted-foreground/10 p-3">
            <div className="rounded-full bg-muted-foreground/20 p-2">
              <span className="text-6xl">🔍</span>
            </div>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground text-center max-w-[500px]">
          {` Sorry, we couldn't find the page you're looking for. Perhaps you've
          mistyped the URL or the page has been moved.`}
        </p>
      </div>
      <Button asChild>
        <Link href="/" className="gap-2">
          <HomeIcon size={16} />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
