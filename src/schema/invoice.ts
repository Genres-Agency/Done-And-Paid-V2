import * as z from "zod";

export const InvoiceItemSchema = z.object({
  name: z.string().min(1, "Product/Service name is required"),
  description: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  total: z.number().optional(), // Calculated field
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
  customerCompany: z.string().optional(),
  customerTaxNumber: z.string().optional(),
  customerBillingAddress: z.string().optional(),
  customerNotes: z.string().optional(),

  // Invoice Details
  invoiceNumber: z.string().optional(), // Made optional since it's generated
  invoiceDate: z.date(),
  dueDate: z.date(),
  referenceNumber: z.string().optional(),
  purchaseOrderNumber: z.string().optional(),
  salespersonName: z.string().optional(),
  currency: z.string().default("USD"),

  // Items
  items: z.array(InvoiceItemSchema).min(1, "At least one item is required"),

  // Financial Details
  subtotal: z.number().min(0).optional(), // Calculated field
  total: z.number().min(0).optional(), // Calculated field

  // Discount
  discountType: z.enum(["percentage", "fixed"]).default("percentage"),
  discountValue: z.number().min(0).default(0),

  // Tax
  taxType: z.enum(["percentage", "fixed"]).default("percentage"),
  taxValue: z.number().min(0).default(0),

  // Payment
  paymentMethod: z
    .enum([
      "CASH",
      "BANK_TRANSFER",
      "CREDIT_CARD",
      "DEBIT_CARD",
      "CHEQUE",
      "ONLINE",
    ])
    .optional(),
  paidAmount: z.number().min(0).default(0),
  installmentOption: z.boolean().default(false),
  installmentDetails: z
    .object({
      numberOfInstallments: z.number().min(1),
      installmentAmount: z.number().min(0),
      frequency: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
      startDate: z.date(),
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
