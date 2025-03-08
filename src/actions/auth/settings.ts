"use server";
import { getUserById } from "@/src/lib/actions/user.action";
import { currentUser } from "@/src/lib/auth";
import { db } from "@/src/lib/database.connection";
import { SettingsSchema } from "@/src/schema";
import * as z from "zod";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  // Only update fields that are provided
  const updateData = {
    ...(values.name && { name: values.name }),
    ...(values.email && { email: values.email }),
    ...(values.image !== undefined && { image: values.image }), // Allow null to remove image
    ...(values.isTwoFactorEnabled !== undefined && {
      isTwoFactorEnabled: values.isTwoFactorEnabled,
    }),
  };

  try {
    await db.user.update({
      where: { id: dbUser.id },
      data: updateData,
    });

    return { success: "Settings Updated!" };
  } catch (error) {
    return { error: "Failed to update settings" };
  }
};
