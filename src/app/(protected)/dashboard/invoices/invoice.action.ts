"use server";

import prisma from "@/prisma";
import { PaymentStatus } from "@prisma/client";

type CreateInvoiceData = {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  dueDate: Date;
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
      subtotal: data.subtotal,
      tax: data.tax,
      discount: data.discount,
      total: data.total,
      notes: data.notes,
      dueDate: data.dueDate,
      createdById: data.createdById,
      paymentStatus: PaymentStatus.PENDING,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        })),
      },
    },
    include: {
      items: true,
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
