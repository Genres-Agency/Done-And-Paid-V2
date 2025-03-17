import * as z from "zod";

export const QuoteItemSchema = z.object({
  name: z.string().min(1, "Product/Service name is required"),
  description: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  total: z.number().optional(), // Calculated field
});

export const QuoteSchema = z.object({
  // Business Information
  businessName: z.string().min(1, "Business name is required"),
  businessLogo: z.string().optional(),
  businessAddress: z.string().min(1, "Business address is required"),
  businessPhone: z.string().min(1, "Business phone is required"),
  businessEmail: z.string().email("Invalid email address"),
  businessWebsite: z.string().url("Invalid URL").optional(),
  businessTaxNumber: z.string().optional(),
  businessRegistrationNumber: z.string().optional(),
  businessCategory: z.string().optional(),

  // Customer Information
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(1, "Customer phone is required"),
  customerAddress: z.string().min(1, "Customer address is required"),
  customerShippingAddress: z.string().optional(),
  customerLogo: z.string().optional(),
  customerId: z.string().optional(),
  customerCompany: z.string().optional(),
  customerTaxNumber: z.string().optional(),
  customerBillingAddress: z.string().optional(),
  customerNotes: z.string().optional(),

  // Quote Details
  quoteNumber: z.string().optional(), // Made optional since it's generated
  quoteDate: z.date(),
  validUntil: z.date(),
  referenceNumber: z.string().optional(),
  salespersonName: z.string().optional(),
  currency: z.string().default("USD"),

  // Items
  items: z.array(QuoteItemSchema).min(1, "At least one item is required"),

  // Financial Details
  subtotal: z.number().min(0).optional(), // Calculated field
  total: z.number().min(0).optional(), // Calculated field

  // Discount
  discountType: z.enum(["percentage", "fixed"]).default("percentage"),
  discountValue: z.number().min(0).default(0),

  // Tax
  taxType: z.enum(["percentage", "fixed"]).default("percentage"),
  taxValue: z.number().min(0).default(0),

  // Quote Status
  status: z
    .enum(["DRAFT", "PENDING", "APPROVED", "REJECTED", "CONVERTED", "EXPIRED"])
    .default("DRAFT"),

  // Notes & Terms
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
});

export type QuoteFormValues = z.infer<typeof QuoteSchema>;
