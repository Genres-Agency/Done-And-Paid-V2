import { z } from "zod";
import { BlogStatus } from "@prisma/client";

export const blogSchema = z.object({
  id: z.string(),
  titleEn: z.string(),
  titleBn: z.string(),
  slugEn: z.string(),
  slugBn: z.string(),
  contentEn: z.string(),
  contentBn: z.string(),
  categoryEn: z.string().nullable(),
  categoryBn: z.string().nullable(),
  mediaId: z.string().nullable(),
  status: z.nativeEnum(BlogStatus),
  scheduledAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  media: z.object({
    url: z.string(),
    type: z.enum(["IMAGE", "VIDEO"]),
  }).nullable(),
});

export type BlogItem = z.infer<typeof blogSchema>;

export const statuses = [
  {
    value: "PUBLISHED",
    label: "Published",
  },
  {
    value: "PRIVATE",
    label: "Private",
  },
  {
    value: "SCHEDULED",
    label: "Scheduled",
  },
];

export const getCategoryOptions = (categories: any[]) =>
  categories.map((category) => ({
    value: category.nameEn,
    label: category.nameEn,
  }));