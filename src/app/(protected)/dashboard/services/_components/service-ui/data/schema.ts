import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const NewsStatus = z.enum(["PUBLISHED", "PRIVATE", "SCHEDULED"]);
export type NewsStatusType = z.infer<typeof NewsStatus>;

export const newsSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  category: z.string(),
  mediaId: z.string().nullable(),
  media: z
    .object({
      id: z.string(),
      url: z.string(),
      type: z.enum(["IMAGE", "VIDEO"]),
      title: z.string(),
    })
    .nullable(),
  status: NewsStatus,
  createdAt: z.date(),
  updatedAt: z.date(),
  label: z.string().optional(),
});

export type NewsItem = z.infer<typeof newsSchema>;

// Keep the existing taskSchema if needed
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
