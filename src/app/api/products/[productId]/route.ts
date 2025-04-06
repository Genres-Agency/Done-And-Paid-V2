import { NextResponse } from "next/server";
import { db } from "@/src/lib/database.connection";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const body = await request.json();
    const {
      name,
      description,
      sku,
      price,
      cost,
      supplierId,
      minStock,
      quantity,
    } = body;

    const product = await db.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        description,
        sku,
        price,
        cost,
        supplierId,
        inventory: {
          update: {
            quantity,
            minStock,
          },
        },
      },
      include: {
        supplier: true,
        inventory: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
