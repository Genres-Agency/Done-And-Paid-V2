"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAllMedia } from "../media-action";
import { format } from "date-fns";
import Image from "next/image";

export function RecentUploads() {
  const { data: mediaItems } = useQuery({
    queryKey: ["media"],
    queryFn: getAllMedia,
  });

  const recentItems = mediaItems?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recentItems.map((item) => (
            <div key={item.id} className="space-y-2">
              {item.type === "IMAGE" ? (
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-1 text-sm">
                <h3 className="font-medium leading-none">{item.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(item.createdAt), "PPp")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
