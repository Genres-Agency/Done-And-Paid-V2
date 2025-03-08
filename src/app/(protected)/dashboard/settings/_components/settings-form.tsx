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
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import React from "react";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import { SettingsSchema } from "@/src/schema";
import { settings } from "@/src/actions/auth/settings";

export function SettingsForm() {
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isChanged, setIsChanged] = useState(false);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
    },
  });

  // Watch for form changes
  const formValues = form.watch();
  const initialValues = React.useRef({
    name: user?.name || undefined,
    email: user?.email || undefined,
  });

  // Check if form values have changed
  const hasChanges = React.useCallback(() => {
    return (
      formValues.name !== initialValues.current.name ||
      formValues.email !== initialValues.current.email
    );
  }, [formValues]);

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

        // Update session with new values
        await update({
          name: values.name,
          email: values.email,
        });

        // Update initial values reference
        initialValues.current = {
          name: values.name || undefined,
          email: values.email || undefined,
        };

        form.reset(values);
        setIsChanged(false);
        toast.success("Settings updated successfully");

        // Force a page refresh to ensure all components update
        window.location.reload();
      } catch (error) {
        toast.error("Failed to update settings");
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>General Settings</CardTitle>
        <Card className="flex items-center gap-2 text-sm text-muted-foreground p-3 px-5">
          Role: <span className="font-medium">{user?.role || "USER"}</span>
        </Card>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your name"
                      disabled={isPending}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your email"
                      type="email"
                      disabled={isPending}
                      value={field.value || ""}
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
