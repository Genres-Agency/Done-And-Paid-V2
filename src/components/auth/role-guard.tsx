"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@prisma/client";
import { useCurrentUser } from "@/src/hooks/use-current-user";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const RoleGuard = ({
  children,
  allowedRoles,
  redirectTo = "/not-found",
}: RoleGuardProps) => {
  const router = useRouter();
  const user = useCurrentUser();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      router.push(redirectTo);
    }
  }, [user, allowedRoles, router, redirectTo]);

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};
