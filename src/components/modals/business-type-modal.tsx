"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { BusinessTypeSchema } from "@/src/schema";
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

interface BusinessTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (businessType: string) => void;
}

export const BusinessTypeModal = ({
  isOpen,
  onClose,
  onSubmit,
}: BusinessTypeModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof BusinessTypeSchema>>({
    resolver: zodResolver(BusinessTypeSchema),
    defaultValues: {
      businessType: undefined,
    },
  });

  const handleSubmit = async (values: z.infer<typeof BusinessTypeSchema>) => {
    try {
      setIsLoading(true);
      await onSubmit(values.businessType);
      onClose();
    } catch (error) {
      console.error("Error updating business type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Your Business Type</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="RETAIL" id="retail" />
                        <label htmlFor="retail" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Retail</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="WHOLESALE" id="wholesale" />
                        <label htmlFor="wholesale" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Wholesale</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="MANUFACTURING" id="manufacturing" />
                        <label htmlFor="manufacturing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Manufacturing</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="SERVICE" id="service" />
                        <label htmlFor="service" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Service</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4">
              <Button
                disabled={isLoading}
                variant="outline"
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
