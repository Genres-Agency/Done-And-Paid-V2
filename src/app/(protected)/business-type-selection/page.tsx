"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Button } from "@/src/components/ui/button";
import { BusinessTypeSchema } from "@/src/schema";
import { updateBusinessType } from "@/src/actions/auth/update-business-type";

const BusinessTypeSelectionPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof BusinessTypeSchema>>({
    resolver: zodResolver(BusinessTypeSchema),
    defaultValues: {
      businessType: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof BusinessTypeSchema>) => {
    try {
      setIsLoading(true);
      if (session?.user?.id) {
        await updateBusinessType(session.user.id, values.businessType as any);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error updating business type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      return;
    }
    if (session?.user?.businessType) {
      router.push("/dashboard");
      return;
    }
  }, [session, router]);

  if (!session || session?.user?.businessType) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 space-y-4 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-foreground">
          Welcome to Your Dashboard
        </h1>
        <p className="text-center text-muted-foreground">
          Please select your business type to continue
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                      disabled={isLoading}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="RETAIL" id="retail" />
                        <label
                          htmlFor="retail"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Retail
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="WHOLESALE" id="wholesale" />
                        <label
                          htmlFor="wholesale"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Wholesale
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="MANUFACTURING"
                          id="manufacturing"
                        />
                        <label
                          htmlFor="manufacturing"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Manufacturing
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="SERVICE" id="service" />
                        <label
                          htmlFor="service"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Service
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Continue"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BusinessTypeSelectionPage;
