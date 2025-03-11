// customer.action.ts

import prisma from "@/prisma"; // Adjust the import path as necessary

export async function upsertCustomer(data: {
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  company?: string;
  companyLogo?: string;
  taxNumber?: string;
  billingAddress?: string;
  shippingAddress?: string;
  notes?: string;
}) {
  const customer = await prisma.customer.upsert({
    where: { email: data.email },
    update: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address,
      company: data.company,
      companyLogo: data.companyLogo,
      taxNumber: data.taxNumber,
      billingAddress: data.billingAddress,
      shippingAddress: data.shippingAddress,
      notes: data.notes,
    },
    create: {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      company: data.company,
      companyLogo: data.companyLogo,
      taxNumber: data.taxNumber,
      billingAddress: data.billingAddress,
      shippingAddress: data.shippingAddress,
      notes: data.notes,
    },
  });

  return customer;
}

export async function getCustomers() {
  const customers = await prisma.customer.findMany();
  return customers;
}

export async function getCustomerById(id: string) {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });
  return customer;
}

export async function deleteCustomer(id: string) {
  const customer = await prisma.customer.delete({
    where: { id },
  });
  return customer;
}
