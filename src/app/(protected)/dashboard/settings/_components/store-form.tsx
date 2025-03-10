"use client";

import { useEffect } from "react";
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
import React from "react";
import { SettingsSchema } from "@/src/schema";
import { settings } from "@/src/actions/auth/settings";

interface StoreFormProps {
  initialData?: z.infer<typeof SettingsSchema>;
}

export function StoreForm({ initialData }: StoreFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isChanged, setIsChanged] = useState(false);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      storeName: initialData?.storeName || "",
      storeLegalName: initialData?.storeLegalName || "",
      storeTaxNumber: initialData?.storeTaxNumber || "",
      storeEmail: initialData?.storeEmail || "",
      storePhoneNumber: initialData?.storePhoneNumber || "",
      storeAddress: initialData?.storeAddress || "",
      storeCity: initialData?.storeCity || "",
      storeState: initialData?.storeState || "",
      storeCountry: initialData?.storeCountry || "",
      storePostalCode: initialData?.storePostalCode || "",
      storeWebsite: initialData?.storeWebsite || "",
      storeCurrency: initialData?.storeCurrency || "",
      storeBusinessHours: initialData?.storeBusinessHours || "",
      storeDescription: initialData?.storeDescription || "",
      storeTermsAndConditions: initialData?.storeTermsAndConditions || "",
      storePrivacyPolicy: initialData?.storePrivacyPolicy || "",
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        storeName: initialData.storeName || "",
        storeLegalName: initialData.storeLegalName || "",
        storeTaxNumber: initialData.storeTaxNumber || "",
        storeEmail: initialData.storeEmail || "",
        storePhoneNumber: initialData.storePhoneNumber || "",
        storeAddress: initialData.storeAddress || "",
        storeCity: initialData.storeCity || "",
        storeState: initialData.storeState || "",
        storeCountry: initialData.storeCountry || "",
        storePostalCode: initialData.storePostalCode || "",
        storeWebsite: initialData.storeWebsite || "",
        storeCurrency: initialData.storeCurrency || "",
        storeBusinessHours: initialData.storeBusinessHours || "",
        storeDescription: initialData.storeDescription || "",
        storeTermsAndConditions: initialData.storeTermsAndConditions || "",
        storePrivacyPolicy: initialData.storePrivacyPolicy || "",
      });
    }
  }, [initialData, form]);

  // Watch for form changes
  const formValues = form.watch();
  const initialValues = React.useRef(form.getValues());

  // Check if form values have changed
  const hasChanges = React.useCallback(() => {
    const currentValues = form.getValues();
    return Object.keys(currentValues).some(
      (key) =>
        currentValues[key as keyof typeof currentValues] !==
        initialValues.current[key as keyof typeof initialValues.current]
    );
  }, [form]);

  // Update isChanged state when form values change
  React.useEffect(() => {
    setIsChanged(hasChanges());
  }, [formValues, hasChanges]);

  const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
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

        // Update initial values reference
        initialValues.current = form.getValues();
        setIsChanged(false);
        toast.success("Store settings updated successfully");
      } catch (error) {
        toast.error("Failed to update store settings");
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Store Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="storePhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter phone number"
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
                        value={field.value ?? ""}
                        placeholder="Enter website URL"
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
                  <FormLabel>Address</FormLabel>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

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
                  <FormLabel>Terms and Conditions</FormLabel>
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

            <Button
              type="submit"
              disabled={!isChanged || isPending}
              className="w-full"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
