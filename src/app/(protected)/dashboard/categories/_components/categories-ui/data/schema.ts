import { z } from "zod";

export const NewsStatus = z.enum(["PUBLISHED", "PRIVATE", "SCHEDULED"]);
export type NewsStatusType = z.infer<typeof NewsStatus>;

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  status: NewsStatus,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CategoryItem = z.infer<typeof categorySchema>;
