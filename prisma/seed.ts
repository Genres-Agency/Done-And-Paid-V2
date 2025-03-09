import {
  UserRole,
  PaymentStatus,
  PaymentMethod,
  TransactionType,
} from "@prisma/client";
import prisma from "../prisma";

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

  console.log("Seeding invoices...");
  const invoices = await prisma.$transaction([
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-2024-001",
        customerId: customers[0].id,
        subtotal: 3899.97,
        tax: 389.99,
        total: 4289.96,
        dueDate: new Date("2024-02-15"),
        paymentStatus: PaymentStatus.PAID,
        createdById: users[0].id,
        approvedById: users[1].id,
        notes: "Bulk order for office setup",
        items: {
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
        payments: {
          create: {
            amount: 4289.96,
            paymentMethod: PaymentMethod.BANK_TRANSFER,
            reference: "TRX123456",
            notes: "Full payment received",
          },
        },
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: "INV-2024-002",
        customerId: customers[1].id,
        subtotal: 1299.99,
        tax: 130.0,
        total: 1429.99,
        dueDate: new Date("2024-02-28"),
        paymentStatus: PaymentStatus.PENDING,
        createdById: users[0].id,
        notes: "Initial office equipment",
        items: {
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
