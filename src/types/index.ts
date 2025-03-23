import { UserRole, BusinessType } from "@prisma/client";
import { Icons } from "../components/icons";

export interface NavItem {
  title: string;
  url?: string;
  icon?: keyof typeof Icons;
  shortcut?: string[];
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    shortcut?: string[];
    disabled?: boolean;
  }[];
  disabled?: boolean;
  allowedRoles?: UserRole[];
  allowedBusinessTypes?: BusinessType[];
}
