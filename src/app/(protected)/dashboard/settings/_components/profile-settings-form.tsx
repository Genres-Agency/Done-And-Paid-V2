"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
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
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import React from "react";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import { SettingsSchema } from "@/src/schema";
import { settings } from "@/src/actions/auth/settings";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { MediaSelectorModal } from "../../media/_components/MediaSelectorModal";
import { uploadToImageBB } from "@/src/lib/image-upload";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";

const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof ProfileSchema>;

const formFields = [
  {
    section: "Profile Information",
    fields: [
      { name: "name", label: "Name", type: "text", placeholder: "Your name" },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Your email",
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "tel",
        placeholder: "Your phone number",
      },
      {
        name: "address",
        label: "Address",
        type: "text",
        placeholder: "Your address",
      },
      {
        name: "bio",
        label: "Bio",
        type: "textarea",
        placeholder: "Tell us about yourself",
      },
    ],
  },
];

export function ProfileSettingsForm() {
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isChanged, setIsChanged] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: "",
      address: "",
      bio: "",
      image: user?.image || "",
    },
  });

  // Watch for form changes
  const formValues = form.watch();
  const initialValues = React.useRef<ProfileFormValues>(form.getValues());

  // Check if form values have changed
  const hasChanges = React.useCallback(() => {
    const currentValues = form.getValues();
    return Object.keys(currentValues).some(
      (key) =>
        currentValues[key as keyof ProfileFormValues] !==
        initialValues.current[key as keyof ProfileFormValues]
    );
  }, [form]);

  // Update isChanged state when form values change
  React.useEffect(() => {
    setIsChanged(hasChanges());
  }, [formValues, hasChanges]);

  const handleFileSelect = async (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConceal = () => {
    setShowMediaSelector(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSaveImage = async () => {
    if (!selectedFile) return;

    try {
      const imageUrl = await uploadToImageBB(selectedFile);
      form.setValue("image", imageUrl);
      setShowMediaSelector(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            update();
            initialValues.current = values;
            setIsChanged(false);
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };

  const renderFormField = (field: (typeof formFields)[0]["fields"][0]) => {
    if (field.type === "textarea") {
      return (
        <FormField
          key={field.name}
          control={form.control}
          name={field.name as keyof ProfileFormValues}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Textarea
                  {...formField}
                  placeholder={field.placeholder}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name as keyof ProfileFormValues}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              <Input
                {...formField}
                type={field.type}
                placeholder={field.placeholder}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl || user?.image || ""} />
          <AvatarFallback>{user?.name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={() => setShowMediaSelector(true)}
            disabled={isPending}
          >
            Change Picture
          </Button>
          <p className="text-sm text-muted-foreground">
            JPG, GIF or PNG. Max size of 2MB.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {formFields.map((section) => (
            <div key={section.section} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{section.section}</h3>
                {isChanged && (
                  <Badge variant="outline" className="ml-auto">
                    Unsaved changes
                  </Badge>
                )}
              </div>
              <Separator />
              <div className="space-y-4">
                {section.fields.map((field) => renderFormField(field))}
              </div>
            </div>
          ))}

          <Button disabled={isPending || !isChanged} type="submit">
            Save Changes
          </Button>
        </form>
      </Form>

      <MediaSelectorModal
        open={showMediaSelector}
        onOpenChange={setShowMediaSelector}
        onMediaSelect={() => {}}
        onFileSelect={handleFileSelect}
        allowedTypes={["upload"]}
        showLibrary={false}
        reset={false}
      />
    </div>
  );
}
