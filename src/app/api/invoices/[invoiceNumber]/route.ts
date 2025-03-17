import { NextResponse } from "next/server";
import prisma from "@/prisma";
export async function GET(
  req: Request,
  { params }: { params: { invoiceNumber: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: {
        invoiceNumber: params.invoiceNumber,
      },
      include: {
        customer: {
          select: {
            name: true,
            phoneNumber: true,
            email: true,
            address: true,
          },
        },
        InvoiceItem: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
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
