import { Card, CardContent } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";

export function BusinessInfoSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[180px]" />
        </div>
      </CardContent>
    </Card>
  );
}
