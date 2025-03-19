"use server";

import prisma from "@/prisma";
import {
  SupplierSchema,
  UpdateSupplierSchema,
  type SupplierFormData,
  type UpdateSupplierFormData,
} from "@/src/schema/supplier";

const handlePrismaError = (error: any, operation: string) => {
  console.error(`Error ${operation}:`, error);
  if (error.code === "P2002") {
    throw new Error(`A supplier with this information already exists`);
  } else if (error.code === "P2025") {
    throw new Error(`Supplier not found`);
  } else if (error.code === "P2003") {
    throw new Error(
      `Failed to delete supplier due to existing references. Please remove related products first.`
    );
  }
  throw new Error(`Failed to ${operation}`);
};

export async function createSupplier(data: SupplierFormData) {
  try {
    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        company: data.company,
        taxNumber: data.taxNumber,
        notes: data.notes,
      },
    });
    return supplier;
  } catch (error) {
    const validationResult = SupplierSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error(validationResult.error.errors[0].message);
    }
    handlePrismaError(error, "create supplier");
  }
}

export async function getSuppliers() {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        products: true,
      },
    });
    return suppliers;
  } catch (error) {
    handlePrismaError(error, "fetch suppliers");
  }
}

export async function getSupplierById(id: string) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!supplier) {
      throw new Error("Supplier not found");
    }

    return supplier;
  } catch (error) {
    handlePrismaError(error, "fetch supplier");
  }
}

export async function updateSupplier(data: UpdateSupplierFormData) {
  try {
    const supplier = await prisma.supplier.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        company: data.company,
        taxNumber: data.taxNumber,
        notes: data.notes,
      },
      include: {
        products: true,
      },
    });

    return supplier;
  } catch (error) {
    const validationResult = UpdateSupplierSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error(validationResult.error.errors[0].message);
    }
    handlePrismaError(error, "update supplier");
  }
}

export async function deleteSupplier(id: string) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!supplier) {
      throw new Error("Supplier not found");
    }

    if (supplier.products.length > 0) {
      throw new Error(
        "Cannot delete supplier with associated products. Please remove or reassign the products first."
      );
    }

    await prisma.supplier.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    handlePrismaError(error, "delete supplier");
  }
}
