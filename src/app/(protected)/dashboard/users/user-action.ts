"use server";

import client from "@/prisma";
import { UserRole } from "@prisma/client";
import { auth } from "@/auth";
import { canChangeUserRole } from "./_components/user-ui/utils";
import bcrypt from "bcryptjs";
import { ADMIN_ROLES } from "@/src/lib/constants";

const ALLOWED_TO_BAN: UserRole[] = [UserRole.ADMIN, UserRole.SUPERADMIN];

export const postNews = async ({
  title,
  content,
  category,
  image,
}: {
  title: string;
  content: string;
  category: string;
  image: string;
}) => {
  try {
    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const news = await client.news.create({
      data: {
        title,
        slug,
        content,
        category,
        mediaId: image,
      },
    });
    return news;
  } catch (error) {
    throw new Error(`Failed to create news: ${error}`);
  }
};

export const getAllNews = async () => {
  try {
    const news = await client.news.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        category: true,
        media: true,
        createdAt: true,
        updatedAt: true,
        status: true,
      },
    });
    return news;
  } catch (error) {
    throw new Error(`Failed to fetch news: ${error}`);
  }
};

export const getAllUsers = async () => {
  try {
    const users = await client.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });
    return users;
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error}`);
  }
};

export const updateUserRole = async (userId: string, newRole: UserRole) => {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    // Get current user's role with better error handling
    const currentUser = await client.user.findUnique({
      where: { id: session.user.id },
    });
    if (!currentUser) throw new Error("Current user not found");

    // Get target user with better error handling
    const targetUser = await client.user.findUnique({
      where: { id: userId },
    });
    if (!targetUser) throw new Error("Target user not found");

    // Prevent self-role modification
    if (userId === session.user.id) {
      throw new Error("Cannot modify your own role");
    }

    // Role-based permission checks
    if (
      !ADMIN_ROLES.includes(currentUser.role as (typeof ADMIN_ROLES)[number])
    ) {
      throw new Error("Insufficient permissions to modify roles");
    }

    return await client.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  } catch (error) {
    throw error;
  }
};

export const banUser = async (userId: string) => {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const currentUser = await client.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || !ALLOWED_TO_BAN.includes(currentUser.role)) {
      throw new Error("Not authorized to ban users");
    }

    // Check if user exists and is not already banned
    const targetUser = await client.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!targetUser) throw new Error("User not found");
    if (targetUser.role === UserRole.BANNED)
      throw new Error("User is already banned");

    const user = await client.user.update({
      where: { id: userId },
      data: { role: UserRole.BANNED },
    });

    return user;
  } catch (error) {
    throw error; // Let the component handle the error
  }
};

export const addUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) => {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const currentUser = await client.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || !canChangeUserRole(currentUser.role, data.role)) {
      throw new Error("Not authorized to create users with this role");
    }

    // Check if email already exists
    const existingUser = await client.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create the user
    const user = await client.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    return user;
  } catch (error) {
    throw error;
  }
};
