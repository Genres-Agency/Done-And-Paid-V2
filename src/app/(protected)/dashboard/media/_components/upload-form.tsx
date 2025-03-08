"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { toast } from "sonner";
import { addMedia } from "../media-action";
import { MediaSelectorModal } from "./MediaSelectorModal";
import { Upload } from "lucide-react";
import Image from "next/image";
import { uploadToImageBB } from "@/src/lib/image-upload";

const youtubeUrlRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})([&?].*)?$/;

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  type: z.enum(["IMAGE", "VIDEO"]),
  videoUrl: z.string().regex(youtubeUrlRegex, "Invalid YouTube URL").optional(),
  mediaId: z.string().optional(),
});

export function UploadForm() {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState(false);
  const [resetImage, setResetImage] = useState(false);
  const router = useRouter();
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<
    "IMAGE" | "VIDEO" | null
  >(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "IMAGE",
      videoUrl: "",
      mediaId: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!selectedFile && !selectedMediaUrl) {
        setImageError(true);
        toast.error("Please select media");
        return;
      }

      setLoading(true);
      let url = "";

      if (selectedMediaType === "IMAGE" && selectedFile) {
        try {
          url = await uploadToImageBB(selectedFile);
        } catch (error) {
          console.error("Failed to upload image:", error);
          toast.error("Failed to upload image to server");
          return;
        }
      } else if (selectedMediaType === "VIDEO" && selectedMediaUrl) {
        const videoId = selectedMediaUrl.match(/([a-zA-Z0-9_-]{11})/)?.[1];
        if (!videoId) {
          throw new Error("Invalid YouTube URL");
        }
        url = `https://www.youtube.com/embed/${videoId}`;
      }

      if (!url) {
        throw new Error("Failed to process media URL");
      }

      try {
        await addMedia({
          title: values.title,
          description: values.description || "",
          type: selectedMediaType || "IMAGE",
          url,
          size: selectedFile?.size || 0,
          mimeType: selectedFile?.type || "video/youtube",
        });

        toast.success(
          `${
            selectedMediaType === "IMAGE" ? "Image" : "Video"
          } uploaded successfully!`
        );
        form.reset();
        setSelectedFile(null);
        setSelectedMediaUrl(null);
        setSelectedMediaType(null);
        setResetImage(true);
        router.refresh();
      } catch (error) {
        console.error("Failed to save media:", error);
        toast.error("Failed to save media to database");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        `Failed to upload ${selectedMediaType?.toLowerCase() || "media"}`
      );
    } finally {
      setLoading(false);
      setResetImage(false);
    }
  };

  const handleMediaSelect = (
    id: string,
    url: string,
    type: "IMAGE" | "VIDEO"
  ) => {
    setSelectedMediaType(type);
    setSelectedMediaUrl(url);
    form.setValue("type", type);
    if (type === "VIDEO") {
      form.setValue("videoUrl", url);
      const videoId = url.match(/([a-zA-Z0-9_-]{11})/)?.[1];
      if (videoId) {
        setSelectedMediaUrl(`https://www.youtube.com/embed/${videoId}`);
      }
    }
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setSelectedMediaType("IMAGE");
    setSelectedMediaUrl(file ? URL.createObjectURL(file) : null);
    form.setValue("type", "IMAGE");
    setImageError(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter media title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter media description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mediaId"
              render={() => (
                <FormItem>
                  <FormLabel className={imageError ? "text-red-500" : ""}>
                    Media
                  </FormLabel>
                  <div
                    className="cursor-pointer border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors"
                    onClick={() => setShowMediaSelector(true)}
                  >
                    {selectedMediaUrl ? (
                      <div className="relative aspect-video w-full max-w-sm mx-auto">
                        {selectedMediaType === "IMAGE" ? (
                          <Image
                            src={selectedMediaUrl}
                            alt="Selected media"
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <iframe
                            src={selectedMediaUrl}
                            className="w-full h-full rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to select banner media
                        </p>
                      </div>
                    )}
                  </div>
                  {imageError && (
                    <p className="text-sm font-medium text-red-500">
                      Please select media
                    </p>
                  )}
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload Media"}
            </Button>
          </form>
        </Form>

        <MediaSelectorModal
          open={showMediaSelector}
          onOpenChange={setShowMediaSelector}
          onMediaSelect={handleMediaSelect}
          onFileSelect={handleFileSelect}
          reset={resetImage}
          imageError={imageError}
          showLibrary={false}
          allowedTypes={["upload", "video"]}
        />
      </CardContent>
    </Card>
  );
}
