import * as z from "zod";

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
  isTwoFactorEnabled: z.optional(z.boolean()),
  image: z.optional(z.string()),
});
