import { NextResponse } from "next/server";
import { db } from "@/src/lib/database.connection";

export async function GET() {
  try {
    const products = await db.product.findMany({
      include: {
        supplier: true,
        inventory: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    const product = await db.product.create({
      data: {
        name,
        description,
        sku,
        price,
        cost,
        supplierId,
        inventory: {
          create: {
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
    console.error("Error creating product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
