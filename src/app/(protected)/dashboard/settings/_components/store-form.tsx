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
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import { settings } from "@/src/actions/auth/settings";

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
      storeWebsite: "",
      storeCurrency: "USD",
      storeBusinessHours: "",
      storeDescription: "",
      storeTermsAndConditions: "",
      storePrivacyPolicy: "",
    },
  });

  const onSubmit = async (values: StoreFormValues) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            update();
          }
        })
        .catch(() => toast.error("Something went wrong!"));
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

        <div className="space-y-4">
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
        </div>

        <div className="space-y-4">
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
        </div>

        <Button disabled={isPending} type="submit">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
