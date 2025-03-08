import { UserRole } from "@prisma/client";

export const statuses = [
  {
    value: "PRIVATE",
    label: "Private",
    iconName: "eyeOff",
  },
  {
    value: "PUBLISHED",
    label: "Published",
    iconName: "eye",
  },
];

export const getCategoryOptions = (categories: any[]) => {
  return categories
    .filter((category) => category.status === "PUBLISHED")
    .map((category) => ({
      label: category.name,
      value: category.name,
    }));
};

export const userRoles = [
  {
    value: UserRole.PATIENT,
    label: "Patient",
    iconName: "user",
  },
  {
    value: UserRole.ADMIN,
    label: "Admin",
    iconName: "shield",
  },
  {
    value: UserRole.SUPERADMIN,
    label: "Super Admin",
    iconName: "crown",
  },
  {
    value: UserRole.DENTIST,
    label: "Dentist",
    iconName: "pen",
  },
  {
    value: UserRole.STAFF,
    label: "Staff",
    iconName: "staff",
  },
  {
    value: UserRole.BANNED,
    label: "Banned",
    iconName: "ban",
  },
];
