import * as z from "zod";

export const SupplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  taxNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const UpdateSupplierSchema = z.object({
  id: z.string().min(1, "ID is required"),
  ...SupplierSchema.shape,
});

export type SupplierFormData = z.infer<typeof SupplierSchema>;
export type UpdateSupplierFormData = z.infer<typeof UpdateSupplierSchema>;
