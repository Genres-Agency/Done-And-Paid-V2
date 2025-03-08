"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { updateNews } from "../../news-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format, set } from "date-fns";
import { addMedia } from "../../../media/media-action";
import { MediaSelectorModal } from "../../../media/_components/MediaSelectorModal";
import { Upload } from "lucide-react";
import Image from "next/image";
import { uploadToImageBB } from "@/src/lib/image-upload";
import { DateTimePicker } from "@/src/components/DateTimePicker";

const formSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(10),
  category: z.string(),
  mediaId: z.string().optional(),
  status: z.enum(["PUBLISHED", "PRIVATE", "SCHEDULED"]),
  scheduledAt: z.date().optional(),
  scheduledTime: z.string().optional(),
});

export function EditNewsDialog({
  news,
  categories,
  open,
  onOpenChange,
}: {
  news: any;
  categories: any[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(
    news.mediaId
  );
  const router = useRouter();
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<
    "IMAGE" | "VIDEO" | null
  >(news.media?.type || null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(
    news.media?.url || null
  );
  const [imageError, setImageError] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: news.title,
      content: news.content,
      category: news.category,
      mediaId: news.mediaId,
      status: news.status,
      scheduledAt: news.scheduledAt ? new Date(news.scheduledAt) : undefined,
      scheduledTime: news.scheduledAt
        ? format(new Date(news.scheduledAt), "HH:mm")
        : undefined,
    },
  });

  const handleMediaSelect = (
    id: string,
    url: string,
    type: "IMAGE" | "VIDEO"
  ) => {
    setSelectedMediaType(type);
    setSelectedMediaUrl(url);
    setSelectedMediaId(id);
    setSelectedFile(null);
    setImageError(false);
    form.setValue("mediaId", id);
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setSelectedMediaType("IMAGE");
    setSelectedMediaUrl(file ? URL.createObjectURL(file) : null);
    setSelectedMediaId(null);
    setImageError(false);
    form.setValue("mediaId", undefined);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!selectedFile && !selectedMediaId && !selectedMediaUrl) {
        setImageError(true);
        toast.error("Please select media");
        return;
      }

      let finalMediaId = selectedMediaId;

      if (selectedFile) {
        const imageUrl = await uploadToImageBB(selectedFile);
        const newMedia = await addMedia({
          title: values.title,
          url: imageUrl,
          type: "IMAGE",
          description: "News banner image",
          size: selectedFile.size,
          mimeType: selectedFile.type,
        });
        finalMediaId = newMedia.id;
      } else if (selectedMediaUrl && selectedMediaType === "VIDEO") {
        const videoId = selectedMediaUrl.match(/([a-zA-Z0-9_-]{11})/)?.[1];
        if (videoId) {
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          const newMedia = await addMedia({
            title: values.title,
            url: embedUrl,
            type: "VIDEO",
            description: "News banner video",
            size: 0,
            mimeType: "video/youtube",
          });
          finalMediaId = newMedia.id;
        }
      }

      let scheduledDateTime = undefined;
      if (
        values.status === "SCHEDULED" &&
        values.scheduledAt &&
        values.scheduledTime
      ) {
        const [hours, minutes] = values.scheduledTime.split(":").map(Number);
        scheduledDateTime = set(values.scheduledAt, {
          hours,
          minutes,
          seconds: 0,
        });
      }

      await updateNews({
        id: news.id,
        ...values,
        mediaId: finalMediaId,
        scheduledAt: scheduledDateTime,
      });

      toast.success("News updated successfully");
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update news");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit News</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value !== "SCHEDULED") {
                        form.setValue("scheduledAt", undefined);
                        form.setValue("scheduledTime", undefined);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("status") === "SCHEDULED" && (
              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Date & Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={(date) => {
                          field.onChange(date);
                          if (date) {
                            const timeString = format(date, "HH:mm");
                            form.setValue("scheduledTime", timeString);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                          Click to select media
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

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>

        <MediaSelectorModal
          open={showMediaSelector}
          onOpenChange={setShowMediaSelector}
          onMediaSelect={handleMediaSelect}
          onFileSelect={handleFileSelect}
          reset={false}
          imageError={imageError}
          showLibrary={true}
          allowedTypes={["upload", "video", "library"]}
        />
      </DialogContent>
    </Dialog>
  );
}
