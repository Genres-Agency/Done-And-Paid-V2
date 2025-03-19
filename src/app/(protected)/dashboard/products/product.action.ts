"use server";

import prisma from "@/prisma";
import {
  ProductSchema,
  UpdateProductSchema,
  type ProductFormData,
  type UpdateProductFormData,
} from "@/src/schema/product";

export type { ProductFormData, UpdateProductFormData };

const handlePrismaError = (error: any, operation: string) => {
  console.error(`Error ${operation}:`, error);
  if (error.code === "P2002") {
    throw new Error(`A product with this SKU already exists`);
  } else if (error.code === "P2025") {
    throw new Error(`Product not found`);
  } else if (error.code === "P2003") {
    throw new Error(
      `Failed to delete product due to existing references. Please remove related records first.`
    );
  }
  throw new Error(`Failed to ${operation}`);
};

export async function createProduct(data: ProductFormData) {
  try {
    // Check if supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: data.supplierId },
    });

    if (!supplier) {
      throw new Error(
        "Invalid supplier selected. Please choose a valid supplier."
      );
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        sku: data.sku,
        price: data.price,
        cost: data.cost,
        supplierId: data.supplierId,
        inventory: {
          create: {
            quantity: data.quantity,
            minStock: data.minStock,
          },
        },
      },
      include: {
        supplier: true,
        inventory: true,
      },
    });

    return product;
  } catch (error) {
    const validationResult = ProductSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error(validationResult.error.errors[0].message);
    }
    handlePrismaError(error, "create product");
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        supplier: true,
        inventory: true,
      },
    });

    return products;
  } catch (error) {
    handlePrismaError(error, "fetch products");
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        supplier: true,
        inventory: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error) {
    handlePrismaError(error, "fetch product");
  }
}

export async function updateProduct(data: UpdateProductFormData) {
  try {
    const product = await prisma.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        sku: data.sku,
        price: data.price,
        cost: data.cost,
        supplierId: data.supplierId,
        inventory:
          data.quantity || data.minStock
            ? {
                upsert: {
                  create: {
                    quantity: data.quantity || 0,
                    minStock: data.minStock || 0,
                  },
                  update: {
                    quantity: data.quantity,
                    minStock: data.minStock,
                  },
                },
              }
            : undefined,
      },
      include: {
        supplier: true,
        inventory: true,
      },
    });

    return product;
  } catch (error) {
    const validationResult = UpdateProductSchema.safeParse(data);
    if (!validationResult.success) {
      throw new Error(validationResult.error.errors[0].message);
    }
    handlePrismaError(error, "update product");
  }
}

export async function deleteProduct(id: string) {
  try {
    // Check if product exists and get its relationships
    const product = await prisma.product.findUnique({
      where: { id },
      include: { inventory: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Delete in transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Delete inventory if exists
      if (product.inventory) {
        await tx.inventory.delete({
          where: { id: product.inventory.id },
        });
      }

      // Delete the product
      await tx.product.delete({
        where: { id },
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    handlePrismaError(error, "delete product");
  }
}

export async function getLowStockProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        inventory: {
          quantity: {
            lte: prisma.inventory.fields.minStock,
          },
        },
      },
      include: {
        supplier: true,
        inventory: true,
      },
    });

    return products;
  } catch (error) {
    handlePrismaError(error, "fetch low stock products");
  }
}

export async function getSuppliers() {
  try {
    const suppliers = await prisma.supplier.findMany();
    return suppliers;
  } catch (error) {
    handlePrismaError(error, "fetch suppliers");
  }
}
