import { Service } from "@prisma/client";

export const statuses = [
  {
    value: "PUBLISHED",
    label: "Published",
    iconName: "check",
  },
  {
    value: "PRIVATE",
    label: "Private",
    iconName: "x",
  },
];

export const durationOptions = [
  { value: "15min", label: "15 Minutes" },
  { value: "30min", label: "30 Minutes" },
  { value: "45min", label: "45 Minutes" },
  { value: "1hr", label: "1 Hour" },
  { value: "1.5hr", label: "1.5 Hours" },
  { value: "2hr", label: "2 Hours" },
  { value: "2.5hr", label: "2.5 Hours" },
  { value: "3hr", label: "3 Hours" },
];

export type ServiceFormValues = {
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  price: number;
  duration: string;
  mediaId?: string;
  status: "PUBLISHED" | "PRIVATE";
};

export type ServiceItem = Service & {
  media?: {
    id: string;
    url: string;
    type: string;
  } | null;
};
