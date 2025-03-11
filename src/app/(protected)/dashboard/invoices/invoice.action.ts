"use server";

import prisma from "@/prisma";
import { PaymentStatus, PaymentMethod } from "@prisma/client";

type CreateInvoiceData = {
  // Customer Information
  customerId: string;

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
  }[];

  // Invoice Details
  invoiceDate: Date;
  dueDate: Date;
  currency?: string;
  language?: string;
  referenceNumber?: string;
  purchaseOrderNumber?: string;
  salespersonName?: string;

  // Financial Details
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paidAmount?: number;

  // Additional Information
  notes?: string;
  termsAndConditions?: string;
  paymentMethod?: PaymentMethod;

  // Metadata
  createdById: string;
};

type UpdateInvoiceStatusData = {
  id: string;
  status: PaymentStatus;
  approvedById?: string;
};

export async function createInvoice(data: CreateInvoiceData) {
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

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      customerId: data.customerId,

      // Business Information
      businessName: data.businessName,
      businessLogo: data.businessLogo,
      businessAddress: data.businessAddress,
      businessPhone: data.businessPhone,
      businessEmail: data.businessEmail,
      businessWebsite: data.businessWebsite,
      businessTaxNumber: data.businessTaxNumber,

      // Invoice Items
      items: data.items,

      // Invoice Details
      invoiceDate: data.invoiceDate || new Date(),
      dueDate: data.dueDate,
      currency: data.currency || "USD",
      language: data.language || "en",
      referenceNumber: data.referenceNumber,
      purchaseOrderNumber: data.purchaseOrderNumber,
      salespersonName: data.salespersonName,

      // Financial Details
      subtotal: data.subtotal,
      tax: data.tax,
      discount: data.discount,
      total: data.total,
      paidAmount: data.paidAmount || 0,

      // Additional Information
      notes: data.notes,
      termsAndConditions: data.termsAndConditions,
      paymentMethod: data.paymentMethod,
      paymentStatus: PaymentStatus.PENDING,

      // Metadata
      createdById: data.createdById,
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
      items: true,
      customer: true,
      createdBy: true,
      approvedBy: true,
      payments: true,
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
      items: true,
      customer: true,
      createdBy: true,
      approvedBy: true,
      payments: true,
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
      items: true,
      customer: true,
      createdBy: true,
      approvedBy: true,
      payments: true,
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
      items: true,
      customer: true,
      createdBy: true,
      approvedBy: true,
      payments: true,
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
      items: true,
      customer: true,
      createdBy: true,
      approvedBy: true,
      payments: true,
    },
  });

  return invoice;
}
