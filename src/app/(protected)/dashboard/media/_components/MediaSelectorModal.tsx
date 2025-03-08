"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Card, CardContent } from "@/src/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getAllMedia } from "../media-action";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { FileVideo } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ImageUpload from "@/src/components/ImageUpload";
import { Input } from "@/src/components/ui/input";

interface MediaSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMediaSelect: (
    mediaId: string,
    url: string,
    type: "IMAGE" | "VIDEO"
  ) => void;
  onFileSelect: (file: File | null) => void;
  defaultImage?: string | null;
  imageError?: boolean;
  reset?: boolean;
  showLibrary?: boolean;
  allowedTypes?: ("upload" | "video" | "library")[];
}

export function MediaSelectorModal({
  open,
  onOpenChange,
  onMediaSelect,
  onFileSelect,
  defaultImage,
  imageError,
  reset,
  showLibrary = true,
  allowedTypes = ["upload", "video", "library"],
}: MediaSelectorModalProps) {
  const { data: mediaItems } = useQuery({
    queryKey: ["media"],
    queryFn: getAllMedia,
  });
  const [mediaFilter, setMediaFilter] = useState<"ALL" | "IMAGE" | "VIDEO">(
    "ALL"
  );

  const filteredMedia =
    mediaItems?.filter((item) => {
      if (mediaFilter === "ALL") return true;
      return item.type === mediaFilter;
    }) || [];

  const handleVideoUrlChange = (url: string) => {
    const videoId = url.match(/([a-zA-Z0-9_-]{11})/)?.[1];
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      onMediaSelect("youtube", embedUrl, "VIDEO");
      onOpenChange(false);
    } else {
      toast.error("Invalid YouTube URL");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Tabs defaultValue={allowedTypes[0]} className="w-full">
            <TabsList
              className="grid w-full"
              style={{
                gridTemplateColumns: `repeat(${allowedTypes.length}, 1fr)`,
              }}
            >
              {allowedTypes.includes("upload") && (
                <TabsTrigger value="upload">Upload New</TabsTrigger>
              )}
              {allowedTypes.includes("video") && (
                <TabsTrigger value="video">YouTube Video</TabsTrigger>
              )}
              {allowedTypes.includes("library") && (
                <TabsTrigger value="library">Media Library</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="upload">
              <Card>
                <CardContent className="pt-6">
                  <ImageUpload
                    onFileSelect={(file) => {
                      onFileSelect(file);
                      if (file) {
                        onOpenChange(false);
                      }
                    }}
                    defaultImage={defaultImage}
                    imageError={imageError}
                    reset={reset}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="video">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Label>YouTube Video URL</Label>
                    <Input
                      type="url"
                      placeholder="Enter YouTube video URL"
                      onChange={(e) => {
                        if (e.target.value) {
                          handleVideoUrlChange(e.target.value);
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="library">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <Select
                    value={mediaFilter}
                    onValueChange={(value: any) => setMediaFilter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter media" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Media</SelectItem>
                      <SelectItem value="IMAGE">Images Only</SelectItem>
                      <SelectItem value="VIDEO">Videos Only</SelectItem>
                    </SelectContent>
                  </Select>

                  <RadioGroup
                    onValueChange={(value) => {
                      const media = filteredMedia.find((m) => m.id === value);
                      if (media) {
                        onMediaSelect(media.id, media.url, media.type);
                        onOpenChange(false);
                      }
                    }}
                  >
                    <div className="grid grid-cols-4 gap-4">
                      {filteredMedia.map((media) => (
                        <div key={media.id} className="space-y-2">
                          <RadioGroupItem
                            value={media.id}
                            id={media.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={media.id}
                            className="block cursor-pointer rounded-lg border-2 border-muted peer-checked:border-primary"
                          >
                            <div className="relative aspect-video overflow-hidden rounded-lg">
                              {media.type === "IMAGE" ? (
                                <Image
                                  src={media.url}
                                  alt={media.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center bg-muted">
                                  <FileVideo className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <p className="mt-2 text-xs font-medium truncate">
                              {media.title}
                            </p>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
