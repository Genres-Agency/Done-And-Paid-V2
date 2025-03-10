"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";
import { CalendarIcon, Trash2Icon, PlusIcon } from "lucide-react";

const createInvoiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitPrice: z.number().min(0, "Unit price must be non-negative"),
      })
    )
    .min(1, "At least one item is required"),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  discount: z.number().min(0),
  total: z.number().min(0),
  notes: z.string().optional(),
  dueDate: z.date(),
});

type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;

export default function CreateInvoiceForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateInvoiceFormData>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      dueDate: new Date(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const calculateTotals = (items: any[]) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const tax = subtotal * 0.1; // 10% tax rate
    const total = subtotal + tax - form.getValues("discount");

    form.setValue("subtotal", subtotal);
    form.setValue("tax", tax);
    form.setValue("total", total);
  };

  const onSubmit = async (data: CreateInvoiceFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create invoice");
      }

      toast.success("Invoice created successfully");
      router.push("/dashboard/invoices");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Customer</label>
          <Select
            onValueChange={(value) => form.setValue("customerId", value)}
            defaultValue={form.getValues("customerId")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {/* Add customer options here */}
              <SelectItem value="customer1">Customer 1</SelectItem>
              <SelectItem value="customer2">Customer 2</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.customerId && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.customerId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.getValues("dueDate") && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.getValues("dueDate") ? (
                  format(form.getValues("dueDate"), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.getValues("dueDate")}
                onSelect={(date) =>
                  form.setValue("dueDate", date || new Date())
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Line Items</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ productId: "", quantity: 1, unitPrice: 0 })
              }
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start">
              <div className="flex-1">
                <Select
                  onValueChange={(value) =>
                    form.setValue(`items.${index}.productId`, value)
                  }
                  defaultValue={field.productId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Add product options here */}
                    <SelectItem value="product1">Product 1</SelectItem>
                    <SelectItem value="product2">Product 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  placeholder="Qty"
                  {...form.register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                    onChange: () => calculateTotals(form.getValues("items")),
                  })}
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  {...form.register(`items.${index}.unitPrice`, {
                    valueAsNumber: true,
                    onChange: () => calculateTotals(form.getValues("items")),
                  })}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Subtotal</label>
            <Input
              type="number"
              step="0.01"
              readOnly
              {...form.register("subtotal", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tax (10%)</label>
            <Input
              type="number"
              step="0.01"
              readOnly
              {...form.register("tax", { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Discount</label>
            <Input
              type="number"
              step="0.01"
              {...form.register("discount", {
                valueAsNumber: true,
                onChange: () => calculateTotals(form.getValues("items")),
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total</label>
            <Input
              type="number"
              step="0.01"
              readOnly
              {...form.register("total", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <Textarea
            placeholder="Add any notes or special instructions"
            {...form.register("notes")}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
