"use server";

import prisma from "@/prisma";
import { PaymentStatus, PaymentMethod } from "@prisma/client";

import { randomUUID } from "crypto";

export type CreateInvoiceData = {
  // Customer Information
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
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

  // Invoice Items
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    description?: string;
    total?: number;
  }[];

  // Invoice Details
  invoiceDate: Date;
  dueDate: Date;
  currency?: string;
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
  paidAmount?: number;

  // Additional Information
  notes?: string;
  termsAndConditions?: string;
  paymentMethod?: PaymentMethod;
  installmentOption?: boolean;
  installmentDetails?: {
    numberOfInstallments: number;
    installmentAmount: number;
    frequency: "weekly" | "monthly" | "quarterly" | "yearly";
    startDate: Date;
  };

  // Metadata
  createdById: string;
  isDraft?: boolean;
};

type UpdateInvoiceStatusData = {
  id: string;
  status: PaymentStatus;
  approvedById?: string;
};

export async function createInvoice(data: CreateInvoiceData) {
  // Generate a new customer ID if not provided
  const customerId = data.customerId || randomUUID();
  const customerName = data.customerName || "New Customer";

  // Create or update customer
  const customer = await prisma.customer.upsert({
    where: {
      id: customerId,
    },
    create: {
      id: customerId,
      name: customerName,
      email: data.customerEmail,
      phoneNumber: data.customerPhone,
      address: data.customerAddress,
      company: data.customerCompany,
      companyLogo: data.customerLogo,
      taxNumber: data.customerTaxNumber,
      billingAddress: data.customerBillingAddress,
      shippingAddress: data.customerShippingAddress,
      notes: data.customerNotes,
    },
    update: {
      name: customerName,
      phoneNumber: data.customerPhone,
      address: data.customerAddress,
      company: data.customerCompany,
      companyLogo: data.customerLogo,
      taxNumber: data.customerTaxNumber,
      billingAddress: data.customerBillingAddress,
      shippingAddress: data.customerShippingAddress,
      notes: data.customerNotes,
    },
  });

  // Generate invoice number (format: INV-YYYYMMDD-XXXX)
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      invoiceNumber: {
        startsWith: `INV-${dateStr}`,
      },
    },
    orderBy: {
      invoiceNumber: "desc",
    },
  });

  const sequence = lastInvoice
    ? String(Number(lastInvoice.invoiceNumber.split("-")[2]) + 1).padStart(
        4,
        "0"
      )
    : "0001";
  const invoiceNumber = `INV-${dateStr}-${sequence}`;

  // Calculate totals for each item
  const itemsJson = data.items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    description: item.description,
    total: item.quantity * item.unitPrice,
  }));

  // Create the invoice with the customer ID
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      customerId: customer.id,

      // Business Information
      businessName: data.businessName,
      businessLogo: data.businessLogo,
      businessAddress: data.businessAddress,
      businessPhone: data.businessPhone,
      businessEmail: data.businessEmail,
      businessWebsite: data.businessWebsite,
      businessTaxNumber: data.businessTaxNumber,

      // Store items as JSON
      items: itemsJson,

      // Invoice Details
      invoiceDate: data.invoiceDate || new Date(),
      dueDate: data.dueDate,
      currency: data.currency || "USD",
      referenceNumber: data.referenceNumber,
      purchaseOrderNumber: data.purchaseOrderNumber,
      salespersonName: data.salespersonName,

      // Financial Details
      subtotal: data.subtotal,
      discountType: data.discountType,
      discountValue: data.discountValue,
      taxType: data.taxType,
      taxValue: data.taxValue,
      total: data.total,
      paidAmount: data.paidAmount || 0,

      // Additional Information
      notes: data.notes,
      termsAndConditions: data.termsAndConditions,
      paymentMethod: data.paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      installmentOption: data.installmentOption,
      installmentDetails: data.installmentDetails,

      // Metadata
      createdById: data.createdById,
      isDraft: data.isDraft || false,
    },
    include: {
      customer: true,
      createdBy: true,
    },
  });

  return invoice;
}

export async function getInvoices() {
  const invoices = await prisma.invoice.findMany({
    include: {
      InvoiceItem: {
        include: {
          product: true,
        },
      },
      customer: true,
      createdBy: true,
      approvedBy: true,
      Payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return invoices;
}

export async function getInvoiceById(id: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      InvoiceItem: true,
      customer: true,
      createdBy: true,
      approvedBy: true,
      Payment: true,
    },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  return invoice;
}

export async function getPendingInvoices() {
  const invoices = await prisma.invoice.findMany({
    where: {
      paymentStatus: PaymentStatus.PENDING,
    },
    include: {
      InvoiceItem: true,
      customer: true,
      createdBy: true,
      approvedBy: true,
      Payment: true,
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  return invoices;
}

export async function getPaymentHistory() {
  const invoices = await prisma.invoice.findMany({
    where: {
      paymentStatus: PaymentStatus.PAID,
    },
    include: {
      InvoiceItem: true,
      customer: true,
      createdBy: true,
      approvedBy: true,
      Payment: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return invoices;
}

export async function updateInvoiceStatus(data: UpdateInvoiceStatusData) {
  const invoice = await prisma.invoice.update({
    where: { id: data.id },
    data: {
      paymentStatus: data.status,
      approvedById: data.approvedById,
    },
    include: {
      InvoiceItem: true,
      customer: true,
      createdBy: true,
      approvedBy: true,
      Payment: true,
    },
  });

  return invoice;
}

export async function getInvoiceByNumber(invoiceNumber: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: {
        invoiceNumber,
      },
      include: {
        InvoiceItem: true,
        customer: true,
        createdBy: true,
        approvedBy: true,
        Payment: true,
      },
    });

    return invoice;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }
}

export async function saveInvoiceDraft(
  data: CreateInvoiceData & { id?: string }
) {
  try {
    // Calculate totals for each item
    const itemsJson = data.items.map((item) => ({
      name: item.name || "",
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice || 0,
      description: item.description,
      total: (item.quantity || 0) * (item.unitPrice || 0),
    }));

    // If updating an existing draft
    if (data.id) {
      return await prisma.invoice.update({
        where: { id: data.id },
        data: {
          customerId: data.customerId,
          businessName: data.businessName || "",
          businessLogo: data.businessLogo,
          businessAddress: data.businessAddress || "",
          businessPhone: data.businessPhone || "",
          businessEmail: data.businessEmail || "",
          businessWebsite: data.businessWebsite,
          businessTaxNumber: data.businessTaxNumber,
          items: itemsJson,
          invoiceDate: data.invoiceDate || new Date(),
          dueDate: data.dueDate || new Date(),
          currency: data.currency || "USD",
          referenceNumber: data.referenceNumber,
          purchaseOrderNumber: data.purchaseOrderNumber,
          salespersonName: data.salespersonName,
          subtotal: data.subtotal || 0,
          discountType: data.discountType || "percentage",
          discountValue: data.discountValue || 0,
          taxType: data.taxType || "percentage",
          taxValue: data.taxValue || 0,
          total: data.total || 0,
          paidAmount: data.paidAmount || 0,
          notes: data.notes,
          termsAndConditions: data.termsAndConditions,
          paymentMethod: data.paymentMethod,
          installmentOption: data.installmentOption || false,
          installmentDetails: data.installmentDetails,
          isDraft: true,
        },
        include: {
          customer: true,
          createdBy: true,
        },
      });
    }

    // Generate a temporary invoice number for the draft
    const draftNumber = `DRAFT-${randomUUID().slice(0, 8)}`;

    // Create new draft
    return await prisma.invoice.create({
      data: {
        invoiceNumber: draftNumber,
        customerId: data.customerId,
        businessName: data.businessName || "",
        businessLogo: data.businessLogo,
        businessAddress: data.businessAddress || "",
        businessPhone: data.businessPhone || "",
        businessEmail: data.businessEmail || "",
        businessWebsite: data.businessWebsite,
        businessTaxNumber: data.businessTaxNumber,
        items: itemsJson,
        invoiceDate: data.invoiceDate || new Date(),
        dueDate: data.dueDate || new Date(),
        currency: data.currency || "USD",
        referenceNumber: data.referenceNumber,
        purchaseOrderNumber: data.purchaseOrderNumber,
        salespersonName: data.salespersonName,
        subtotal: data.subtotal || 0,
        discountType: data.discountType || "percentage",
        discountValue: data.discountValue || 0,
        taxType: data.taxType || "percentage",
        taxValue: data.taxValue || 0,
        total: data.total || 0,
        paidAmount: data.paidAmount || 0,
        notes: data.notes,
        termsAndConditions: data.termsAndConditions,
        paymentMethod: data.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        installmentOption: data.installmentOption || false,
        installmentDetails: data.installmentDetails,
        createdById: data.createdById,
        isDraft: true,
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

export async function getMostRecentDraftInvoice(userId: string) {
  return await prisma.invoice.findFirst({
    where: {
      createdById: userId,
      isDraft: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      customer: true,
    },
  });
}
