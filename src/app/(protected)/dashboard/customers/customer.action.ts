"use server";

import { db } from "@/src/lib/database.connection";

export async function upsertCustomer(data: {
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
}) {
  try {
    const customer = await db.customer.upsert({
      where: {
        email: data.email,
      },
      update: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        address: data.address,
      },
      create: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
      },
    });

    return customer;
  } catch (error) {
    console.error("[CUSTOMER_UPSERT]", error);
    throw new Error("Failed to create/update customer");
  }
}
