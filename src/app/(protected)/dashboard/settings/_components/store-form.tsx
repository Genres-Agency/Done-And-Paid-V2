"use client";

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
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import { settings } from "@/src/actions/auth/settings";
import { MediaSelectorModal } from "../../media/_components/MediaSelectorModal";
import { uploadToImageBB } from "@/src/lib/image-upload";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import Image from "next/image";
import { db } from "@/src/lib/database.connection";

const StoreSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeLegalName: z.string().optional(),
  storeTaxNumber: z.string().optional(),
  storeEmail: z.string().email().optional(),
  storePhoneNumber: z.string().optional(),
  storeAddress: z.string().optional(),
  storeCity: z.string().optional(),
  storeState: z.string().optional(),
  storeCountry: z.string().optional(),
  storePostalCode: z.string().optional(),
  storeLogo: z.string().optional(),
  storeWebsite: z.string().url().optional(),
  storeCurrency: z.string().optional(),
  storeBusinessHours: z.string().optional(),
  storeDescription: z.string().optional(),
  storeTermsAndConditions: z.string().optional(),
  storePrivacyPolicy: z.string().optional(),
});

type StoreFormValues = z.infer<typeof StoreSchema>;

export function StoreForm() {
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isChanged, setIsChanged] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
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
      storeLogo: "",
      storeWebsite: "",
      storeCurrency: "USD",
      storeBusinessHours: "",
      storeDescription: "",
      storeTermsAndConditions: "",
      storePrivacyPolicy: "",
    },
  });

  // Watch for form changes
  const formValues = form.watch();
  const initialValues = useRef<StoreFormValues>(form.getValues());

  // Check if form values have changed
  const hasChanges = useCallback(() => {
    const currentValues = form.getValues();
    return Object.keys(currentValues).some(
      (key) =>
        currentValues[key as keyof StoreFormValues] !==
        initialValues.current[key as keyof StoreFormValues]
    );
  }, [form]);

  // Update isChanged state when form values change
  useEffect(() => {
    setIsChanged(hasChanges());
  }, [formValues, hasChanges]);

  // Fetch store data on mount
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch("/api/store");
        const data = await response.json();

        if (data.store) {
          form.reset({
            storeName: data.store.name || "",
            storeLegalName: data.store.legalName || "",
            storeTaxNumber: data.store.taxNumber || "",
            storeEmail: data.store.email || "",
            storePhoneNumber: data.store.phoneNumber || "",
            storeAddress: data.store.address || "",
            storeCity: data.store.city || "",
            storeState: data.store.state || "",
            storeCountry: data.store.country || "",
            storePostalCode: data.store.postalCode || "",
            storeLogo: data.store.logo || "",
            storeWebsite: data.store.website || "",
            storeCurrency: data.store.currency || "USD",
            storeBusinessHours: data.store.businessHours || "",
            storeDescription: data.store.description || "",
            storeTermsAndConditions: data.store.termsAndConditions || "",
            storePrivacyPolicy: data.store.privacyPolicy || "",
          });
          initialValues.current = form.getValues();
        }
      } catch (error) {
        console.error("Failed to fetch store data:", error);
        toast.error("Failed to load store data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [form]);

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

  const handleSaveLogo = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      startTransition(async () => {
        const imageUrl = await uploadToImageBB(selectedFile);
        const currentFormValues = form.getValues();
        const response = await settings({
          ...currentFormValues,
          storeLogo: imageUrl,
        });

        if (response.error) {
          toast.error(response.error);
          return;
        }

        // Update form state with new logo
        form.setValue("storeLogo", imageUrl);

        await update();
        initialValues.current = {
          ...initialValues.current,
          storeLogo: imageUrl,
        };
        setShowMediaSelector(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsChanged(false);
        toast.success("Store logo updated successfully");
      });
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const onSubmit = async (values: StoreFormValues) => {
    startTransition(async () => {
      try {
        const response = await settings(values);

        if (response.error) {
          toast.error(response.error);
          return;
        }

        await update();
        initialValues.current = values;
        setIsChanged(false);
        toast.success("Store settings updated successfully");
      } catch (error) {
        toast.error("Something went wrong!");
      }
    });
  };

  if (isLoading) {
    return <div>Loading store data...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
          {previewUrl || form.getValues("storeLogo") ? (
            <Image
              src={previewUrl || form.getValues("storeLogo") || ""}
              alt="Store Logo"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-sm text-muted-foreground">No logo</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          {!selectedFile ? (
            <Button
              variant="outline"
              onClick={() => setShowMediaSelector(true)}
              disabled={isPending}
            >
              Change Logo
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleConceal}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveLogo} disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            JPG, GIF or PNG. Max size of 2MB.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Store Information</h3>
            {isChanged && (
              <Badge variant="outline" className="ml-auto">
                Unsaved changes
              </Badge>
            )}
          </div>
          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter store name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeLegalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter legal name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeTaxNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter tax number"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter store email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storePhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="tel"
                      placeholder="Enter store phone"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="Enter website URL"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter currency (e.g., USD)"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeBusinessHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Hours</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter business hours"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="storeAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter store address"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-4">
            <FormField
              control={form.control}
              name="storeCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter city"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter state"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter country"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storePostalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter postal code"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="storeDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter store description"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storeTermsAndConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms & Conditions</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter terms and conditions"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storePrivacyPolicy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Privacy Policy</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter privacy policy"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
