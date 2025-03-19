"use client";
import { Product, Supplier, Inventory } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/src/components/ui/button";
import { createProduct, updateProduct } from "../product.action";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useEffect, useState } from "react";
import { db } from "@/src/lib/database.connection";
import { Wand2 } from "lucide-react";

interface ProductFormProps {
  initialData?: Product & {
    supplier: Supplier;
    inventory: Inventory | null;
  };
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
  cost: z.coerce.number().min(0, "Cost must be greater than or equal to 0"),
  supplierId: z.string().min(1, "Supplier is required"),
  minStock: z.coerce
    .number()
    .min(0, "Minimum stock must be greater than or equal to 0"),
  quantity: z.coerce
    .number()
    .min(0, "Quantity must be greater than or equal to 0"),
});

export default function ProductForm({ initialData }: ProductFormProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliers = await db.supplier.findMany();
        setSuppliers(suppliers);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);
  const generateSKU = (supplierName: string) => {
    const prefix = supplierName.slice(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description ?? "",
          sku: initialData.sku,
          price: initialData.price,
          cost: initialData.cost,
          supplierId: initialData.supplierId,
          minStock: initialData.inventory?.minStock ?? 0,
          quantity: initialData.inventory?.quantity ?? 0,
        }
      : {
          name: "",
          description: "",
          sku: "",
          price: 0,
          cost: 0,
          supplierId: "",
          minStock: 0,
          quantity: 0,
        },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        await updateProduct({
          id: initialData.id,
          ...values,
        });
      } else {
        await createProduct(values);
      }
      window.location.href = "/dashboard/products";
    } catch (error) {
      console.error("Error saving product:", error);
      if (error instanceof Error) {
        form.setError("root", { message: error.message });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Product SKU" {...field} />
                    {initialData && !field.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={() => {
                          const selectedSupplier = suppliers.find(
                            (s) => s.id === form.getValues().supplierId
                          );
                          if (selectedSupplier) {
                            form.setValue(
                              "sku",
                              generateSKU(selectedSupplier.name)
                            );
                          }
                        }}
                      >
                        <Wand2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    const selectedSupplier = suppliers.find(
                      (s) => s.id === value
                    );
                    if (selectedSupplier && !initialData) {
                      form.setValue("sku", generateSKU(selectedSupplier.name));
                    }
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a supplier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">
          {initialData ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}
