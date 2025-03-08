"use client";

import { useQuery } from "@tanstack/react-query";
import { getMediaByType } from "../media-action";
import { Card, CardContent } from "@/src/components/ui/card";
import Image from "next/image";
import { format } from "date-fns";

export function ImageGallery() {
  const { data: images } = useQuery({
    queryKey: ["images"],
    queryFn: () => getMediaByType("IMAGE"),
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images?.map((image) => (
            <div key={image.id} className="space-y-2">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={image.url}
                  alt={image.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1 text-sm">
                <h3 className="font-medium leading-none">{image.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(image.createdAt), "PPp")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
