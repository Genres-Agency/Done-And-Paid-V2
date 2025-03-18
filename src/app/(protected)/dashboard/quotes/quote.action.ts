import prisma from "@/prisma";
import { QuoteWithCustomer } from "@/src/types/quote";

export async function getQuotes(): Promise<QuoteWithCustomer[]> {
  try {
    const quotes = await prisma.quote.findMany({
      include: {
        customer: true,
        createdBy: true,
        approvedBy: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return quotes;
  } catch (error) {
    console.error("Error fetching quotes:", error);
    throw new Error("Failed to fetch quotes");
  }
}

export async function getQuoteByNumber(
  quoteNumber: string
): Promise<QuoteWithCustomer | null> {
  try {
    const quote = await prisma.quote.findUnique({
      where: {
        quoteNumber,
      },
      include: {
        customer: true,
        createdBy: true,
        approvedBy: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return quote;
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw new Error("Failed to fetch quote");
  }
}
