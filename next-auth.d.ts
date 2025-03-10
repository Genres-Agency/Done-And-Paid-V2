import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFacorEnabled: boolean;
  isOAuth: boolean;
  phoneNumber: string | null;
  address: string | null;
  bio: string | null;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      image?: string;
      phoneNumber: string | null;
      address: string | null;
      bio: string | null;
      isTwoFactorEnabled: boolean;
    };
  }

  interface JWT {
    role?: UserRole;
  }
}
