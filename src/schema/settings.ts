import * as z from "zod";

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
  isTwoFactorEnabled: z.optional(z.boolean()),
  image: z.optional(z.string()),
  // Store Information
  storeName: z.optional(z.string()),
  storeLegalName: z.optional(z.string()),
  storeTaxNumber: z.optional(z.string()),
  storeEmail: z.optional(z.string().email()),
  storePhoneNumber: z.optional(z.string()),
  storeAddress: z.optional(z.string()),
  storeCity: z.optional(z.string()),
  storeState: z.optional(z.string()),
  storeCountry: z.optional(z.string()),
  storePostalCode: z.optional(z.string()),
  storeLogo: z.optional(z.string()),
  storeWebsite: z.optional(z.string().url()),
  storeCurrency: z.optional(z.string()),
  storeBusinessHours: z.optional(z.string()),
  storeDescription: z.optional(z.string()),
  storeTermsAndConditions: z.optional(z.string()),
  storePrivacyPolicy: z.optional(z.string())
});
