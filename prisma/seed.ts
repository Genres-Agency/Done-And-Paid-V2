import {
  UserRole,
  PaymentStatus,
  PaymentMethod,
  TransactionType,
  QuoteStatus,
} from "@prisma/client";
import prisma from "../prisma";
import { addDays } from "date-fns";

async function main() {
  console.log("Seeding users...");
  const users = await prisma.$transaction([
    prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@gmail.com",
        password:
          "$2a$10$D32T4lzBzuucgBgqhUzqQ.KU2r.enUML9L0ihVcy8Odn0AdkOsuja", // "aaaaaa"
        role: UserRole.SUPERADMIN,
        phoneNumber: "+1234567890",
        address: "123 Admin Street",
        bio: "System administrator",
        isTwoFactorEnabled: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Manager User",
        email: "manager@example.com",
        password:
          "$2a$10$D32T4lzBzuucgBgqhUzqQ.KU2r.enUML9L0ihVcy8Odn0AdkOsuja",
        role: UserRole.MANAGER,
        phoneNumber: "+1234567891",
        address: "456 Manager Avenue",
        bio: "Business manager",
      },
    }),
    prisma.user.create({
      data: {
        name: "Accountant User",
        email: "accountant@example.com",
        password:
          "$2a$10$D32T4lzBzuucgBgqhUzqQ.KU2r.enUML9L0ihVcy8Odn0AdkOsuja",
        role: UserRole.ACCOUNTANT,
        phoneNumber: "+1234567892",
        address: "789 Finance Street",
        bio: "Financial accountant",
      },
    }),
  ]);
  console.log("✅ Users seeded successfully!");

  console.log("Seeding suppliers...");
  const suppliers = await prisma.$transaction([
    prisma.supplier.create({
      data: {
        name: "Tech Supplies Ltd",
        email: "contact@techsupplies.com",
        phoneNumber: "+1234567893",
        address: "101 Supply Chain Road",
        company: "Tech Supplies Ltd",
        taxNumber: "TAX123456",
        notes: "Primary electronics supplier",
      },
    }),
    prisma.supplier.create({
      data: {
        name: "Office Essentials Inc",
        email: "sales@officeessentials.com",
        phoneNumber: "+1234567894",
        address: "202 Business Park",
        company: "Office Essentials Inc",
        taxNumber: "TAX789012",
        notes: "Office supplies vendor",
      },
    }),
  ]);
  console.log("✅ Suppliers seeded successfully!");

  console.log("Seeding products...");
  const products = await prisma.$transaction([
    prisma.product.create({
      data: {
        name: "Laptop Pro X1",
        description: "High-performance business laptop",
        sku: "LP-X1-001",
        price: 1299.99,
        cost: 899.99,
        supplierId: suppliers[0].id,
        inventory: {
          create: {
            quantity: 50,
            minStock: 10,
            maxStock: 100,
            location: "Warehouse A",
          },
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Office Chair Deluxe",
        description: "Ergonomic office chair",
        sku: "OC-DLX-002",
        price: 299.99,
        cost: 150.0,
        supplierId: suppliers[1].id,
        inventory: {
          create: {
            quantity: 100,
            minStock: 20,
            maxStock: 200,
            location: "Warehouse B",
          },
        },
      },
    }),
  ]);
  console.log("✅ Products seeded successfully!");

  console.log("Seeding customers...");
  const customers = await prisma.$transaction([
    prisma.customer.create({
      data: {
        name: "Acme Corporation",
        email: "purchasing@acme.com",
        phoneNumber: "+1234567895",
        address: "303 Corporate Plaza",
        company: "Acme Corporation",
        taxNumber: "TAX345678",
        notes: "Large enterprise client",
      },
    }),
    prisma.customer.create({
      data: {
        name: "Startup Innovations",
        email: "office@startupinnovations.com",
        phoneNumber: "+1234567896",
        address: "404 Innovation Hub",
        company: "Startup Innovations LLC",
        taxNumber: "TAX901234",
        notes: "Growing startup client",
      },
    }),
  ]);
  console.log("✅ Customers seeded successfully!");

  console.log("Seeding store...");
  const store = await prisma.store.create({
    data: {
      name: "GenRes Solutions",
      legalName: "GenRes Solutions Inc.",
      taxNumber: "TAX987654321",
      email: "contact@genres.com",
      phoneNumber: "+1234567897",
      address: "505 Business Center", // Make this required in store creation
      city: "Tech City",
      state: "Innovation State",
      country: "United States",
      postalCode: "12345",
      website: "https://genres.com",
      currency: "USD",
      businessHours: "Mon-Fri: 9:00 AM - 6:00 PM",
      description: "Leading business solutions provider",
      termsAndConditions: "Standard terms and conditions apply...",
      privacyPolicy: "Privacy policy details...",
    },
  });
  console.log("✅ Store seeded successfully!");

  console.log("Seeding quotes...");
  await prisma.$transaction([
    prisma.quote.create({
      data: {
        quoteNumber: "QT-2024-001",
        customerId: customers[0].id,
        businessName: store.name,
        businessLogo: store.logo || undefined,
        businessAddress: store.address || "",
        businessPhone: store.phoneNumber || "",
        businessEmail: store.email || "",
        businessWebsite: store.website,
        businessTaxNumber: store.taxNumber,
        quoteDate: new Date(),
        validUntil: addDays(new Date(), 15),
        currency: store.currency,
        referenceNumber: "QREF001",
        salespersonName: "John Doe",
        subtotal: 3899.97,
        discountType: "percentage",
        discountValue: 5,
        taxType: "percentage",
        taxValue: 10,
        total: 4094.97,
        notes: "Bulk order quote for office setup",
        termsAndConditions: store.termsAndConditions,
        status: QuoteStatus.PENDING,
        isDraft: false,
        validityPeriod: 15,
        // Remove revisionNumber as it's not defined in the Prisma schema
        createdById: users[0].id,
        approvedById: users[1].id,
        items: {
          create: [
            {
              productId: products[0].id,
              description: "High-performance business laptop",
              quantity: 2,
              unitPrice: 1299.99,
              discountType: "percentage",
              discountValue: 0,
              taxType: "percentage",
              taxValue: 10,
              total: 2599.98,
            },
            {
              productId: products[1].id,
              description: "Ergonomic office chair",
              quantity: 5,
              unitPrice: 299.99,
              discountType: "percentage",
              discountValue: 0,
              taxType: "percentage",
              taxValue: 10,
              total: 1499.95,
            },
          ],
        },
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
    }),
    prisma.quote.create({
      data: {
        quoteNumber: "QT-2024-002",
        customerId: customers[1].id,
        businessName: store.name,
        businessLogo: store.logo || undefined,
        businessAddress: store.address || "",
        businessPhone: store.phoneNumber || "",
        businessEmail: store.email || "",
        businessWebsite: store.website,
        businessTaxNumber: store.taxNumber,
        quoteDate: new Date(),
        validUntil: addDays(new Date(), 15),
        currency: store.currency,
        referenceNumber: "QREF002",
        salespersonName: "Jane Smith",
        subtotal: 1299.99,
        discountType: "percentage",
        discountValue: 10,
        taxType: "percentage",
        taxValue: 10,
        total: 1299.99,
        notes: "Single laptop quote",
        termsAndConditions: store.termsAndConditions,
        status: QuoteStatus.DRAFT,
        isDraft: true,
        validityPeriod: 15,
        createdById: users[0].id,
        items: {
          create: [
            {
              productId: products[0].id,
              description: "High-performance business laptop",
              quantity: 1,
              unitPrice: 1299.99,
              discountType: "percentage",
              discountValue: 10,
              taxType: "percentage",
              taxValue: 10,
              total: 1299.99,
            },
          ],
        },
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
    }),
  ]);
  console.log("✅ Quotes seeded successfully!");

  console.log("Seeding invoices...");
  const invoices = await prisma.$transaction([
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-2024-001",
        customerId: customers[0].id,
        businessName: store.name,
        businessLogo: store.logo || undefined,
        businessAddress: store.address || "",
        businessPhone: store.phoneNumber || "",
        businessEmail: store.email || "",
        businessWebsite: store.website,
        businessTaxNumber: store.taxNumber,
        invoiceDate: new Date(),
        dueDate: addDays(new Date(), 30),
        currency: store.currency,
        referenceNumber: "REF001",
        purchaseOrderNumber: "PO001",
        salespersonName: "John Doe",
        subtotal: 3899.97,
        discountType: "percentage",
        discountValue: 0,
        taxType: "percentage",
        taxValue: 10,
        total: 4289.96,
        paidAmount: 4289.96,
        notes: "Bulk order for office setup",
        termsAndConditions: store.termsAndConditions,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        isDraft: false,
        installmentOption: false,
        createdById: users[0].id,
        approvedById: users[1].id,
        items: JSON.stringify([
          {
            name: "Laptop Pro X1",
            quantity: 2,
            unitPrice: 1299.99,
            description: "High-performance business laptop",
            total: 2599.98,
          },
          {
            name: "Office Chair Deluxe",
            quantity: 5,
            unitPrice: 299.99,
            description: "Ergonomic office chair",
            total: 1499.95,
          },
        ]),
        InvoiceItem: {
          create: [
            {
              productId: products[0].id,
              quantity: 2,
              unitPrice: 1299.99,
              total: 2599.98,
            },
            {
              productId: products[1].id,
              quantity: 5,
              unitPrice: 299.99,
              total: 1499.95,
            },
          ],
        },
        Payment: {
          create: {
            amount: 4289.96,
            paymentMethod: PaymentMethod.BANK_TRANSFER,
            reference: "TRX123456",
            notes: "Full payment received",
          },
        },
      },
      include: {
        customer: true,
        createdBy: true,
        approvedBy: true,
        InvoiceItem: {
          include: {
            product: true,
          },
        },
        Payment: true,
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-2024-002",
        customerId: customers[1].id,
        businessName: store.name,
        businessLogo: store.logo || undefined,
        businessAddress: store.address || "",
        businessPhone: store.phoneNumber || "",
        businessEmail: store.email || "",
        businessWebsite: store.website,
        businessTaxNumber: store.taxNumber,
        invoiceDate: new Date(),
        dueDate: addDays(new Date(), 30),
        currency: store.currency,
        referenceNumber: "REF002",
        purchaseOrderNumber: "PO002",
        salespersonName: "Jane Smith",
        subtotal: 1299.99,
        discountType: "percentage",
        discountValue: 10,
        taxType: "percentage",
        taxValue: 10,
        total: 1299.99,
        paidAmount: 0,
        notes: "Single laptop order",
        termsAndConditions: store.termsAndConditions,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        isDraft: false,
        installmentOption: false,
        createdById: users[0].id,
        items: JSON.stringify([
          {
            name: "Laptop Pro X1",
            quantity: 1,
            unitPrice: 1299.99,
            description: "High-performance business laptop",
            total: 1299.99,
          },
        ]),
        InvoiceItem: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              unitPrice: 1299.99,
              total: 1299.99,
            },
          ],
        },
      },
      include: {
        customer: true,
        createdBy: true,
        approvedBy: true,
        InvoiceItem: {
          include: {
            product: true,
          },
        },
        Payment: true,
      },
    }),
  ]);
  console.log("✅ Invoices seeded successfully!");

  console.log("Seeding transactions...");
  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        type: TransactionType.INCOME,
        amount: 4289.96,
        description: "Payment received for INV-2024-001",
        date: new Date(),
        reference: "TRX123456",
        userId: users[2].id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: TransactionType.EXPENSE,
        amount: 5000.0,
        description: "Inventory restock payment",
        date: new Date(),
        reference: "EXP789012",
        userId: users[2].id,
      },
    }),
  ]);
  console.log("✅ Transactions seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
