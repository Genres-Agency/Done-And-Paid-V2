"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/src/components/ui/card";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { updateService } from "../service-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { addMedia } from "../../media/media-action";
import { MediaSelectorModal } from "../../media/_components/MediaSelectorModal";
import { Upload } from "lucide-react";
import Image from "next/image";
import { uploadToImageBB } from "@/src/lib/image-upload";
import { useEffect } from "react";

const formSchema = z.object({
  titleEn: z.string().min(2, "English title is required"),
  titleBn: z.string().min(2, "Bangla title is required"),
  descriptionEn: z
    .string()
    .min(10, "English description must be at least 10 characters"),
  descriptionBn: z
    .string()
    .min(10, "Bangla description must be at least 10 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  duration: z.string().min(1, "Duration is required"),
  mediaId: z.string().optional(),
  status: z.enum(["PUBLISHED", "PRIVATE"]),
});

export default function EditServiceForm() {
  const params = useParams();
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [imageError, setImageError] = React.useState<boolean>(false);
  const [selectedMediaId, setSelectedMediaId] = React.useState<string | null>(
    null
  );
  const [resetImage, setResetImage] = React.useState(false);
  const router = useRouter();
  const [showMediaSelector, setShowMediaSelector] = React.useState(false);
  const [selectedMediaType, setSelectedMediaType] = React.useState<
    "IMAGE" | "VIDEO" | null
  >(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = React.useState<string | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleEn: "",
      titleBn: "",
      descriptionEn: "",
      descriptionBn: "",
      price: 0,
      duration: "30min",
      mediaId: undefined,
      status: "PUBLISHED",
    },
  });

  const fetchService = async () => {
    try {
      const service = await getService(params.id as string);

      form.reset({
        titleEn: service.titleEn,
        titleBn: service.titleBn,
        descriptionEn: service.descriptionEn,
        descriptionBn: service.descriptionBn,
        price: service.price,
        duration: service.duration,
        status: service.status,
        mediaId: service.mediaId,
      });

      if (service.media) {
        setSelectedMediaType(service.media.type);
        setSelectedMediaUrl(service.media.url);
        setSelectedMediaId(service.media.id);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch service");
      router.push("/dashboard/services");
    }
  };

  fetchService();

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

      setSubmitting(true);
      let finalMediaId = selectedMediaId;

      if (selectedFile) {
        const imageUrl = await uploadToImageBB(selectedFile);
        const newMedia = await addMedia({
          title: values.titleEn,
          url: imageUrl,
          type: "IMAGE",
          description: "Service image",
          size: selectedFile.size,
          mimeType: selectedFile.type,
        });
        finalMediaId = newMedia.id;
      } else if (selectedMediaUrl && selectedMediaType === "VIDEO") {
        const videoId = selectedMediaUrl.match(/([a-zA-Z0-9_-]{11})/)?.[1];
        if (videoId) {
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          const newMedia = await addMedia({
            title: values.titleEn,
            url: embedUrl,
            type: "VIDEO",
            description: "Service video",
            size: 0,
            mimeType: "video/youtube",
          });
          finalMediaId = newMedia.id;
        }
      }

      await updateService(params.id as string, {
        ...values,
        mediaId: finalMediaId,
      });

      toast.success("Service updated successfully");
      router.refresh();
      router.push("/dashboard/services");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          Edit Dental Service
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="titleEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name (English)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter service name in English"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titleBn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name (Bangla)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter service name in Bangla"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descriptionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (English)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter service description in English"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descriptionBn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Bangla)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter service description in Bangla"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (BDT)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter service price"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="15min">15 Minutes</SelectItem>
                      <SelectItem value="30min">30 Minutes</SelectItem>
                      <SelectItem value="45min">45 Minutes</SelectItem>
                      <SelectItem value="1hr">1 Hour</SelectItem>
                      <SelectItem value="1.5hr">1.5 Hours</SelectItem>
                      <SelectItem value="2hr">2 Hours</SelectItem>
                      <SelectItem value="2.5hr">2.5 Hours</SelectItem>
                      <SelectItem value="3hr">3 Hours</SelectItem>
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
                    onValueChange={field.onChange}
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
                    </SelectContent>
                  </Select>
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
                    Banner Media
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

            <Button type="submit" disabled={submitting}>
              {submitting ? "Updating..." : "Update Service"}
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
          showLibrary={true}
          allowedTypes={["upload", "video", "library"]}
        />
      </CardContent>
    </Card>
  );
}
