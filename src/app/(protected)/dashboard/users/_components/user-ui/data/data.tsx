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
    value: UserRole.USER,
    label: "USER",
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
    value: UserRole.MANAGER,
    label: "Manager",
    iconName: "briefcase",
  },
  {
    value: UserRole.ACCOUNTANT,
    label: "Accountant",
    iconName: "calculator",
  },
  {
    value: UserRole.SALESPERSON,
    label: "Salesperson",
    iconName: "store",
  },
  {
    value: UserRole.BANNED,
    label: "Banned",
    iconName: "ban",
  },
];
