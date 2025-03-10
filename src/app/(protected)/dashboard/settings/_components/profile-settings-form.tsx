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

import { Switch } from "@/src/components/ui/switch";

type SettingsFormValues = z.infer<typeof SettingsSchema>;

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
  {
    section: "Security Settings",
    fields: [
      {
        name: "password",
        label: "Current Password",
        type: "password",
        placeholder: "Enter current password",
      },
      {
        name: "newPassword",
        label: "New Password",
        type: "password",
        placeholder: "Enter new password",
      },
      {
        name: "isTwoFactorEnabled",
        label: "Two-Factor Authentication",
        type: "switch",
      },
    ],
  },

  {
    section: "Store Information",
    fields: [
      {
        name: "storeName",
        label: "Store Name",
        type: "text",
        placeholder: "Enter store name",
      },
      {
        name: "storeLegalName",
        label: "Legal Name",
        type: "text",
        placeholder: "Enter legal name",
      },
      {
        name: "storeTaxNumber",
        label: "Tax Number",
        type: "text",
        placeholder: "Enter tax number",
      },
      {
        name: "storeEmail",
        label: "Store Email",
        type: "email",
        placeholder: "Enter store email",
      },
      {
        name: "storePhoneNumber",
        label: "Store Phone",
        type: "tel",
        placeholder: "Enter store phone",
      },
      {
        name: "storeAddress",
        label: "Store Address",
        type: "text",
        placeholder: "Enter store address",
      },
      {
        name: "storeCity",
        label: "City",
        type: "text",
        placeholder: "Enter city",
      },
      {
        name: "storeState",
        label: "State",
        type: "text",
        placeholder: "Enter state",
      },
      {
        name: "storeCountry",
        label: "Country",
        type: "text",
        placeholder: "Enter country",
      },
      {
        name: "storePostalCode",
        label: "Postal Code",
        type: "text",
        placeholder: "Enter postal code",
      },
      {
        name: "storeWebsite",
        label: "Website",
        type: "url",
        placeholder: "Enter website URL",
      },
      {
        name: "storeCurrency",
        label: "Currency",
        type: "text",
        placeholder: "Enter currency (e.g., USD)",
      },
      {
        name: "storeBusinessHours",
        label: "Business Hours",
        type: "text",
        placeholder: "Enter business hours",
      },
      {
        name: "storeDescription",
        label: "Description",
        type: "textarea",
        placeholder: "Enter store description",
      },
      {
        name: "storeTermsAndConditions",
        label: "Terms & Conditions",
        type: "textarea",
        placeholder: "Enter terms and conditions",
      },
      {
        name: "storePrivacyPolicy",
        label: "Privacy Policy",
        type: "textarea",
        placeholder: "Enter privacy policy",
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

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: "",
      address: "",
      bio: "",
      isTwoFactorEnabled: false,
      storeName: "",
      storeLegalName: "",
      storeTaxNumber: "",
      storeEmail: "",
      storePhoneNumber: "",
      storeAddress: "",
      storeCity: "",
      storeState: "",
      storeCountry: "",
      storePostalCode: "",
      storeWebsite: "",
      storeCurrency: "",
      storeBusinessHours: "",
      storeDescription: "",
      storeTermsAndConditions: "",
      storePrivacyPolicy: "",
    },
  });

  // Watch for form changes
  const formValues = form.watch();
  const initialValues = React.useRef<SettingsFormValues>(form.getValues());

  // Check if form values have changed
  const hasChanges = React.useCallback(() => {
    const currentValues = form.getValues();
    return Object.keys(currentValues).some(
      (key) =>
        currentValues[key as keyof SettingsFormValues] !==
        initialValues.current[key as keyof SettingsFormValues]
    );
  }, [form]);

  // Update isChanged state when form values change
  React.useEffect(() => {
    setIsChanged(hasChanges());
  }, [formValues, hasChanges]);

  const handleFileSelect = async (file: File | null) => {
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleConceal = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowMediaSelector(false);
  };

  const handleSaveImage = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      startTransition(async () => {
        const imageUrl = await uploadToImageBB(selectedFile);
        const response = await settings({ image: imageUrl });

        if (response.error) {
          toast.error(response.error);
          return;
        }

        await update();
        toast.success("Profile image updated successfully");
        setSelectedFile(null);
        setShowMediaSelector(false);
      });
    } catch (error) {
      toast.error("Failed to update profile image");
    }
  };

  const onSubmit = async (values: SettingsFormValues) => {
    if (!hasChanges()) {
      toast.error("No changes to save");
      return;
    }

    startTransition(async () => {
      try {
        const result = await settings(values);

        if (result.error) {
          toast.error(result.error);
          return;
        }

        // Update session with new values
        await update({
          name: values.name,
          email: values.email,
        });

        // Update initial values reference
        initialValues.current = values;
        form.reset(values);
        setIsChanged(false);
        toast.success("Settings updated successfully");
      } catch (error) {
        toast.error("Failed to update settings");
      }
    });
  };

  const renderFormField = (field: (typeof formFields)[0]["fields"][0]) => {
    switch (field.type) {
      case "textarea":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof SettingsFormValues}
            render={({ field: formField }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">
                  {field.label}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...formField}
                    value={String(formField.value || "")}
                    placeholder={field.placeholder}
                    disabled={isPending}
                    className="min-h-[100px] transition-colors focus:border-primary/50"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        );
      case "switch":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof SettingsFormValues}
            render={({ field: formField }) => (
              <FormItem className="flex items-center justify-between space-y-0">
                <FormLabel className="text-sm font-medium">
                  {field.label}
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={Boolean(formField.value)}
                    onCheckedChange={formField.onChange}
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );
      default:
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof SettingsFormValues}
            render={({ field: formField }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">
                  {field.label}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    value={String(formField.value || "")}
                    type={field.type}
                    placeholder={field.placeholder}
                    disabled={isPending}
                    className="transition-colors focus:border-primary/50"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <Avatar className="w-32 h-32 ring-4 ring-background">
                <AvatarImage src={previewUrl || user?.image || ""} />
                <AvatarFallback className="text-2xl">
                  {user?.name?.charAt(0) || user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                {!selectedFile ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMediaSelector(true)}
                    className="rounded-full"
                  >
                    Change avatar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleConceal}
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveImage}
                      size="sm"
                      disabled={isPending}
                      className="rounded-full"
                    >
                      {isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <h3 className="text-xl font-semibold">{user?.name || "User"}</h3>
              <Badge variant="secondary" className="text-xs">
                {user?.role || "USER"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {formFields.map((section) => (
            <Card key={section.section} className="border-none shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold tracking-tight">
                  {section.section}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field) => renderFormField(field))}
                </div>
                {section.section !==
                  formFields[formFields.length - 1].section && <Separator />}
              </CardContent>
            </Card>
          ))}

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Account Information</p>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <Button
              type="submit"
              disabled={!isChanged || isPending}
              className="transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
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
