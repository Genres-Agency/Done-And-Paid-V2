import { UserRole } from "@prisma/client";

export const ADMIN_ROLES = [UserRole.ADMIN, UserRole.SUPERADMIN] as const;
export const DASHBOARD_ACCESS_ROLES = [
  ...ADMIN_ROLES,
  UserRole.DENTIST,
] as const;
