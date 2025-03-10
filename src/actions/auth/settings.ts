"use server";
import { getUserById } from "@/src/lib/actions/user.action";
import { currentUser } from "@/src/lib/auth";
import { db } from "@/src/lib/database.connection";
import { SettingsSchema } from "@/src/schema";
import * as z from "zod";

const getOrCreateStore = async () => {
  const store = await db.store.findFirst();
  if (store) return store;

  return db.store.create({
    data: {
      name: "My Store",
      currency: "USD",
    },
  });
};

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

  // Store update data
  const storeUpdateData = {
    ...(values.storeName && { name: values.storeName }),
    ...(values.storeLegalName && { legalName: values.storeLegalName }),
    ...(values.storeTaxNumber && { taxNumber: values.storeTaxNumber }),
    ...(values.storeEmail && { email: values.storeEmail }),
    ...(values.storePhoneNumber && { phoneNumber: values.storePhoneNumber }),
    ...(values.storeAddress && { address: values.storeAddress }),
    ...(values.storeCity && { city: values.storeCity }),
    ...(values.storeState && { state: values.storeState }),
    ...(values.storeCountry && { country: values.storeCountry }),
    ...(values.storePostalCode && { postalCode: values.storePostalCode }),
    ...(values.storeLogo && { logo: values.storeLogo }),
    ...(values.storeWebsite && { website: values.storeWebsite }),
    ...(values.storeCurrency && { currency: values.storeCurrency }),
    ...(values.storeBusinessHours && {
      businessHours: values.storeBusinessHours,
    }),
    ...(values.storeDescription && { description: values.storeDescription }),
    ...(values.storeTermsAndConditions && {
      termsAndConditions: values.storeTermsAndConditions,
    }),
    ...(values.storePrivacyPolicy && {
      privacyPolicy: values.storePrivacyPolicy,
    }),
  };

  try {
    // Update user settings
    await db.user.update({
      where: { id: dbUser.id },
      data: updateData,
    });

    // Update store settings
    const store = await getOrCreateStore();
    await db.store.update({
      where: { id: store.id },
      data: storeUpdateData,
    });

    return { success: "Settings Updated!" };
  } catch (error) {
    return { error: "Failed to update settings" };
  }
};
