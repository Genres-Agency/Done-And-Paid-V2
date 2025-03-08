"use client";

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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition, useCallback } from "react";
import { toast } from "sonner";
import React from "react";
import { useSession } from "next-auth/react";
import { settings } from "@/src/actions/auth/settings";

const SecuritySchema = z.object({
  password: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// Move initialValues outside component
const initialValues = {
  password: "",
  newPassword: "",
} as const;

export function SecurityForm() {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isChanged, setIsChanged] = useState(false);

  const form = useForm<z.infer<typeof SecuritySchema>>({
    resolver: zodResolver(SecuritySchema),
    defaultValues: initialValues,
  });

  // Watch for form changes
  const formValues = form.watch();

  // Memoize hasChanges function
  const hasChanges = useCallback(() => {
    return (
      formValues.password !== initialValues.password ||
      formValues.newPassword !== initialValues.newPassword
    );
  }, [formValues.password, formValues.newPassword]); // initialValues is now constant

  // Update isChanged state when form values change
  React.useEffect(() => {
    setIsChanged(hasChanges());
  }, [hasChanges]);

  const onSubmit = async (values: z.infer<typeof SecuritySchema>) => {
    if (!hasChanges()) {
      toast.error("No changes to save");
      return;
    }

    startTransition(async () => {
      try {
        // Send both current and new password
        const result = await settings({
          password: values.password,
          newPassword: values.newPassword,
        });

        if (result.error) {
          // Show specific error message
          if (result.error.includes("current password")) {
            toast.error("Current password is incorrect");
            return;
          }
          toast.error(result.error);
          return;
        }

        await update();
        form.reset({
          password: "",
          newPassword: "",
        });
        setIsChanged(false);
        toast.success("Password updated successfully");
      } catch (error) {
        toast.error("Failed to update password");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter current password"
                      disabled={isPending}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter new password"
                      disabled={isPending}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending || !isChanged}
              className={!isChanged ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
