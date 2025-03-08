"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { FileImage, FileVideo } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllMedia } from "../media-action";

export function MediaStats() {
  const { data: mediaItems } = useQuery({
    queryKey: ["media"],
    queryFn: getAllMedia,
  });

  const totalImages =
    mediaItems?.filter((item) => item.type === "IMAGE").length || 0;
  const totalVideos =
    mediaItems?.filter((item) => item.type === "VIDEO").length || 0;
  const totalSize = mediaItems?.reduce((acc, item) => acc + item.size, 0) || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Images</CardTitle>
          <FileImage className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalImages}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
          <FileVideo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVideos}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
          <FileVideo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(totalSize / (1024 * 1024)).toFixed(2)} MB
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
