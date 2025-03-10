import * as z from "zod";

export const InvoiceItemSchema = z.object({
  name: z.string().min(1, "Product/Service name is required"),
  description: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  discount: z.number().min(0, "Discount must be positive").optional(),
  tax: z.number().min(0, "Tax must be positive").optional(),
});

export const InvoiceSchema = z.object({
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
  customerLoyaltyPoints: z.number().optional(),

  // Invoice Details
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.date(),
  dueDate: z.date(),
  referenceNumber: z.string().optional(),
  purchaseOrderNumber: z.string().optional(),
  salespersonName: z.string().optional(),
  currency: z.string().default("USD"),
  language: z.string().default("en"),

  // Items
  items: z.array(InvoiceItemSchema).min(1, "At least one item is required"),

  // Payment Information
  paymentMethod: z.enum([
    "CASH",
    "BANK_TRANSFER",
    "CREDIT_CARD",
    "DEBIT_CARD",
    "CHEQUE",
    "ONLINE",
  ]),
  paidAmount: z.number().min(0, "Paid amount must be positive"),
  discount: z.number().min(0, "Discount must be positive").optional(),
  tax: z.number().min(0, "Tax must be positive").optional(),
  lateFeePolicy: z.string().optional(),
  advancePayment: z
    .number()
    .min(0, "Advance payment must be positive")
    .optional(),
  installmentOption: z.boolean().default(false),
  installmentDetails: z
    .object({
      numberOfInstallments: z.number().min(1),
      installmentAmount: z.number().min(0),
    })
    .optional(),

  // Shipping Information
  shippingMethod: z.string().optional(),
  trackingNumber: z.string().optional(),
  estimatedDeliveryDate: z.date().optional(),

  // Notes & Terms
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof InvoiceSchema>;
