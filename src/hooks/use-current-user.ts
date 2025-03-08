import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

export const useCurrentUser = () => {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return {
    ...session.user,
    role: session.user.role as UserRole,
    image: session.user.image || null,
  };
};
