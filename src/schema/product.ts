import * as z from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  sku: z
    .string()
    .min(1, "SKU is required")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "SKU must contain only letters, numbers, and hyphens"
    ),
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

export type ProductFormData = z.infer<typeof ProductSchema>;

export const UpdateProductSchema = ProductSchema.partial().extend({
  id: z.string().min(1, "Product ID is required"),
});

export type UpdateProductFormData = z.infer<typeof UpdateProductSchema>;
