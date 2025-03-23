"use server";

import { db } from "@/src/lib/database.connection";
import { BusinessType } from "@prisma/client";

export const updateBusinessType = async (
  userId: string,
  businessType: BusinessType
) => {
  try {
    const user = await db.user.update({
      where: { id: userId },
      data: { businessType },
    });

    return { success: "Business type updated successfully" };
  } catch (error) {
    console.error("Error updating business type:", error);
    return { error: "Failed to update business type" };
  }
};
