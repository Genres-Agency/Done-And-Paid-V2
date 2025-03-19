"use server";
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

export type CreateQuoteInput = {
  // Customer Information
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress: string;
  customerCompany?: string;
  customerLogo?: string;
  customerTaxNumber?: string;
  customerBillingAddress?: string;
  customerShippingAddress?: string;
  customerNotes?: string;

  // Business Information
  businessName: string;
  businessLogo?: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  businessWebsite?: string;
  businessTaxNumber?: string;

  // Quote Items
  items: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    description: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    taxType: "percentage" | "fixed";
    taxValue: number;
    total: number;
  }[];

  // Quote Details
  quoteDate: Date;
  validUntil: Date;
  currency: string;
  referenceNumber?: string;
  purchaseOrderNumber?: string;
  salespersonName?: string;

  // Financial Details
  subtotal: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  taxType: "percentage" | "fixed";
  taxValue: number;
  total: number;

  // Additional Information
  status:
    | "DRAFT"
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "CONVERTED"
    | "EXPIRED";
  validityPeriod: number;
  notes?: string;
  termsAndConditions?: string;
  createdById: string;
};

export async function saveQuoteDraft(data: CreateQuoteInput & { id?: string }) {
  try {
    // Calculate totals for each item
    const itemsWithTotals = data.items.map((item) => ({
      ...item,
      total: (item.quantity || 0) * (item.unitPrice || 0),
    }));

    // If updating an existing draft
    if (data.id) {
      // Update or create customer first
      let customer;
      if (data.customerId) {
        customer = await prisma.customer.update({
          where: { id: data.customerId },
          data: {
            name: data.customerName,
            email: data.customerEmail || undefined,
            phoneNumber: data.customerPhone || undefined,
            address: data.customerAddress || undefined,
            company: data.customerCompany || undefined,
            companyLogo: data.customerLogo || undefined,
            taxNumber: data.customerTaxNumber || undefined,
            billingAddress: data.customerBillingAddress || undefined,
            shippingAddress: data.customerShippingAddress || undefined,
            notes: data.customerNotes || undefined,
          },
        });
      } else {
        customer = await prisma.customer.create({
          data: {
            name: data.customerName,
            email: data.customerEmail || undefined,
            phoneNumber: data.customerPhone || undefined,
            address: data.customerAddress || undefined,
            company: data.customerCompany || undefined,
            companyLogo: data.customerLogo || undefined,
            taxNumber: data.customerTaxNumber || undefined,
            billingAddress: data.customerBillingAddress || undefined,
            shippingAddress: data.customerShippingAddress || undefined,
            notes: data.customerNotes || undefined,
          },
        });
      }

      return await prisma.quote.update({
        where: { id: data.id },
        data: {
          customerId: customer.id,
          businessName: data.businessName || "",
          businessLogo: data.businessLogo,
          businessAddress: data.businessAddress || "",
          businessPhone: data.businessPhone || "",
          businessEmail: data.businessEmail || "",
          businessWebsite: data.businessWebsite,
          businessTaxNumber: data.businessTaxNumber,
          items: {
            deleteMany: {},
            create: itemsWithTotals.map((item) => ({
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
          quoteDate: data.quoteDate || new Date(),
          validUntil: data.validUntil || new Date(),
          currency: data.currency || "USD",
          referenceNumber: data.referenceNumber,
          salespersonName: data.salespersonName,
          subtotal: data.subtotal || 0,
          discountType: data.discountType || "percentage",
          discountValue: data.discountValue || 0,
          taxType: data.taxType || "percentage",
          taxValue: data.taxValue || 0,
          total: data.total || 0,
          status: "DRAFT",
          validityPeriod: data.validityPeriod || 30,
          notes: data.notes,
          termsAndConditions: data.termsAndConditions,
        },
        include: {
          customer: true,
          createdBy: true,
        },
      });
    }

    // Generate a temporary quote number for the draft
    const draftNumber = `DRAFT-${new Date().getTime()}`;

    // Create new draft
    return await prisma.quote.create({
      data: {
        quoteNumber: draftNumber,
        customerId: data.customerId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        customerCompany: data.customerCompany,
        customerLogo: data.customerLogo,
        customerTaxNumber: data.customerTaxNumber,
        customerBillingAddress: data.customerBillingAddress,
        customerShippingAddress: data.customerShippingAddress,
        customerNotes: data.customerNotes,
        businessName: data.businessName || "",
        businessLogo: data.businessLogo,
        businessAddress: data.businessAddress || "",
        businessPhone: data.businessPhone || "",
        businessEmail: data.businessEmail || "",
        businessWebsite: data.businessWebsite,
        businessTaxNumber: data.businessTaxNumber,
        items: {
          create: itemsWithTotals.map((item) => ({
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
        quoteDate: data.quoteDate || new Date(),
        validUntil: data.validUntil || new Date(),
        currency: data.currency || "USD",
        referenceNumber: data.referenceNumber,
        salespersonName: data.salespersonName,
        subtotal: data.subtotal || 0,
        discountType: data.discountType || "percentage",
        discountValue: data.discountValue || 0,
        taxType: data.taxType || "percentage",
        taxValue: data.taxValue || 0,
        total: data.total || 0,
        status: "DRAFT",
        validityPeriod: data.validityPeriod || 30,
        notes: data.notes,
        termsAndConditions: data.termsAndConditions,
        createdById: data.createdById,
      },
      include: {
        customer: true,
        createdBy: true,
      },
    });
  } catch (error) {
    console.error("Error saving draft:", error);
    throw error;
  }
}

export async function getMostRecentDraftQuote(userId: string) {
  return await prisma.quote.findFirst({
    where: {
      createdById: userId,
      status: "DRAFT",
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      customer: true,
    },
  });
}

export async function createQuote(
  input: CreateQuoteInput
): Promise<QuoteWithCustomer> {
  try {
    // Input validation based on schema requirements
    const requiredFields = {
      customerName: {
        value: input.customerName?.trim(),
        message: "Customer name is required",
      },
      customerPhone: {
        value: input.customerPhone?.trim(),
        message: "Customer phone is required",
      },
      customerAddress: {
        value: input.customerAddress?.trim(),
        message: "Customer address is required",
      },
      businessName: {
        value: input.businessName?.trim(),
        message: "Business name is required",
      },
      businessAddress: {
        value: input.businessAddress?.trim(),
        message: "Business address is required",
      },
      businessPhone: {
        value: input.businessPhone?.trim(),
        message: "Business phone is required",
      },
      businessEmail: {
        value: input.businessEmail?.trim(),
        message: "Business email is required",
      },
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, { value }]) => !value)
      .map(([field, { message }]) => `- ${field}: ${message}`);

    if (missingFields.length > 0) {
      throw new Error(
        `Please provide all required information:\n${missingFields.join("\n")}`
      );
    }

    if (!Array.isArray(input.items) || input.items.length === 0) {
      throw new Error("Quote must have at least one item");
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      (input.customerEmail && !emailRegex.test(input.customerEmail)) ||
      !emailRegex.test(input.businessEmail)
    ) {
      throw new Error("Invalid email format");
    }

    // Validate numeric fields
    if (
      isNaN(input.subtotal) ||
      input.subtotal < 0 ||
      isNaN(input.total) ||
      input.total < 0 ||
      isNaN(input.discountValue) ||
      input.discountValue < 0 ||
      isNaN(input.taxValue) ||
      input.taxValue < 0 ||
      isNaN(input.validityPeriod) ||
      input.validityPeriod < 1
    ) {
      throw new Error("Invalid numeric values");
    }

    // Validate dates
    if (
      !(input.quoteDate instanceof Date) ||
      !(input.validUntil instanceof Date)
    ) {
      throw new Error("Invalid date values");
    }

    if (input.validUntil < input.quoteDate) {
      throw new Error("Valid until date must be after quote date");
    }

    // Validate items
    for (const item of input.items) {
      if (item.quantity < 1) {
        throw new Error("Item quantity must be at least 1");
      }
      if (item.unitPrice < 0) {
        throw new Error("Item unit price cannot be negative");
      }
      if (!item.name || !item.description) {
        throw new Error("Item name and description are required");
      }
    }

    // Use transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
      // Generate a unique quote number with retry mechanism
      let attempts = 0;
      let quoteNumber = "";

      while (attempts < 3) {
        const quoteCount = await tx.quote.count();
        quoteNumber = `Q${new Date().getFullYear()}${(quoteCount + 1)
          .toString()
          .padStart(4, "0")}`;

        const existingQuote = await tx.quote.findUnique({
          where: { quoteNumber },
        });

        if (!existingQuote) break;
        attempts++;
      }

      if (attempts === 3) {
        throw new Error("Failed to generate unique quote number");
      }

      // Always create or update customer first to ensure we have a valid customerId
      // Create or update customer and get a valid customerId
      const customerData = {
        name: input.customerName,
        email: input.customerEmail,
        phoneNumber: input.customerPhone,
        address: input.customerAddress,
        company: input.customerCompany,
        companyLogo: input.customerLogo,
        taxNumber: input.customerTaxNumber,
        billingAddress: input.customerBillingAddress,
        shippingAddress: input.customerShippingAddress,
        notes: input.customerNotes,
      };

      const customer =
        input.customerId && input.customerId !== null
          ? await tx.customer.update({
              where: { id: input.customerId },
              data: customerData,
            })
          : await tx.customer.create({
              data: customerData,
            });

      // Validate items
      for (const item of input.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        if (item.quantity <= 0) {
          throw new Error("Item quantity must be greater than 0");
        }
        if (item.unitPrice < 0) {
          throw new Error("Item unit price cannot be negative");
        }
      }

      // Create the quote with all related information
      const quote = (await tx.quote.create({
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
    });
  } catch (error) {
    console.error("Error creating quote:", error);
    throw error instanceof Error ? error : new Error("Failed to create quote");
  }
}
