"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
      {/* Form implementation will be added here */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          {isLoading ? "Creating..." : "Create Invoice"}
        </button>
      </div>
    </form>
  );
}
