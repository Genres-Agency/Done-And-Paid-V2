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

type CreateQuoteInput = {
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  businessName: string;
  businessLogo?: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail?: string;
  businessWebsite?: string;
  businessTaxNumber?: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    description: string;
    discountType?: string;
    discountValue?: number;
    taxType?: string;
    taxValue?: number;
    total: number;
  }[];
  quoteDate: Date;
  validUntil: Date;
  currency: string;
  referenceNumber?: string;
  salespersonName?: string;
  subtotal: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  taxType: "percentage" | "fixed";
  taxValue: number;
  total: number;
  status:
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "CONVERTED"
    | "EXPIRED";
  validityPeriod: number;
  revisionNumber: number;
  notes?: string;
  termsAndConditions?: string;
  createdById: string;
};

export async function createQuote(
  input: CreateQuoteInput
): Promise<QuoteWithCustomer> {
  try {
    // Generate a unique quote number
    const quoteCount = await prisma.quote.count();
    const quoteNumber = `Q${new Date().getFullYear()}${(quoteCount + 1)
      .toString()
      .padStart(4, "0")}`;

    // Create or update customer
    // First try to find an existing customer by email if provided
    let customer;
    if (input.customerEmail) {
      customer = await prisma.customer.findFirst({
        where: {
          email: input.customerEmail,
          name: input.customerName,
        },
      });
    }

    // If no customer found, create a new one
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: input.customerName,
          email: input.customerEmail || null,
          phoneNumber: input.customerPhone,
          address: input.customerAddress,
        },
      });
    } else {
      // Update existing customer
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: input.customerName,
          phoneNumber: input.customerPhone,
          address: input.customerAddress,
        },
      });
    }

    // Create the quote with all related information
    const quote = (await prisma.quote.create({
      data: {
        quoteNumber,
        customerId: customer.id,
        businessName: input.businessName,
        businessLogo: input.businessLogo,
        businessAddress: input.businessAddress,
        businessPhone: input.businessPhone,
        businessEmail: input.businessEmail || "",
        businessWebsite: input.businessWebsite,
        businessTaxNumber: input.businessTaxNumber,
        quoteDate: input.quoteDate,
        validUntil: input.validUntil,
        currency: input.currency,
        referenceNumber: input.referenceNumber,
        salespersonName: input.salespersonName,
        subtotal: input.subtotal,
        discountType: input.discountType,
        discountValue: input.discountValue,
        taxType: input.taxType,
        taxValue: input.taxValue,
        total: input.total,
        status: input.status,
        validityPeriod: input.validityPeriod,
        notes: input.notes,
        termsAndConditions: input.termsAndConditions,
        createdById: input.createdById,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            description: item.description,
            discountType: item.discountType || "percentage",
            discountValue: item.discountValue || 0,
            taxType: item.taxType || "percentage",
            taxValue: item.taxValue || 0,
            total: item.total,
          })),
        },
      },
      include: {
        customer: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            phoneNumber: true,
            address: true,
            bio: true,
            createdAt: true,
            updatedAt: true,
            isTwoFactorEnabled: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            phoneNumber: true,
            address: true,
            bio: true,
            createdAt: true,
            updatedAt: true,
            isTwoFactorEnabled: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    })) as QuoteWithCustomer;

    return quote;
  } catch (error) {
    console.error("Error creating quote:", error);
    throw new Error("Failed to create quote");
  }
}
