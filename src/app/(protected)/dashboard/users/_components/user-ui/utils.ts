import { UserRole } from "@prisma/client";

export const canChangeUserRole = (
  currentUserRole: UserRole,
  targetUserRole: UserRole
) => {
  // SUPERADMIN can change any role
  if (currentUserRole === UserRole.SUPERADMIN) return true;

  // ADMIN can change any role except SUPERADMIN
  if (
    currentUserRole === UserRole.ADMIN &&
    targetUserRole !== UserRole.SUPERADMIN
  )
    return true;

  // Others cannot change roles
  return false;
};

export const getAvailableRoles = (
  currentUserRole: UserRole,
  targetUserRole: UserRole
) => {
  if (currentUserRole === UserRole.SUPERADMIN) {
    return [
      UserRole.ADMIN,
      UserRole.DENTIST,
      UserRole.STAFF,
      UserRole.PATIENT,
      UserRole.SUPERADMIN,
    ];
  }

  if (currentUserRole === UserRole.ADMIN) {
    return [UserRole.PATIENT, UserRole.STAFF, UserRole.ADMIN];
  }

  return [];
};
