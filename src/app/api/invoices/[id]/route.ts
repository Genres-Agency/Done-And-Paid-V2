import { NextResponse } from "next/server";
import prisma from "@/prisma";
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: params.id,
      },
      include: {
        customer: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!invoice) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
