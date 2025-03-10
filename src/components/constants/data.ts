import { NavItem } from "@/src/types";
import { UserRole } from "@prisma/client";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/overview",
    icon: "dashboard",
    shortcut: ["g", "d"],
  },
  {
    title: "Invoices",
    icon: "file",
    shortcut: ["g", "i"],
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
      UserRole.MANAGER,
      UserRole.ACCOUNTANT,
    ],
    items: [
      { title: "Create Invoice", url: "/dashboard/invoices/create" },
      { title: "All Invoices", url: "/dashboard/invoices" },
      { title: "Pending Payments", url: "/dashboard/invoices/pending" },
      { title: "Payment History", url: "/dashboard/invoices/payments" },
    ],
  },
  {
    title: "Quotes",
    icon: "fileText",
    shortcut: ["g", "q"],
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
      UserRole.MANAGER,
      UserRole.ACCOUNTANT,
      UserRole.SALESPERSON,
    ],
    items: [
      { title: "Create Quote", url: "/dashboard/quotes/create" },
      { title: "All Quotes", url: "/dashboard/quotes" },
      { title: "Pending Quotes", url: "/dashboard/quotes/pending" },
      { title: "Expired Quotes", url: "/dashboard/quotes/expired" },
    ],
  },
  {
    title: "Products",
    icon: "package",
    shortcut: ["g", "p"],
    allowedRoles: [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.MANAGER],
    items: [
      { title: "Add Product", url: "/dashboard/products/add" },
      { title: "All Products", url: "/dashboard/products" },
      { title: "Inventory", url: "/dashboard/products/inventory" },
    ],
  },
  {
    title: "Customers",
    icon: "users",
    shortcut: ["g", "c"],
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
      UserRole.MANAGER,
      UserRole.SALESPERSON,
    ],
    items: [
      { title: "Add Customer", url: "/dashboard/customers/add" },
      { title: "All Customers", url: "/dashboard/customers" },
    ],
  },
  {
    title: "Suppliers",
    icon: "truck",
    shortcut: ["g", "s"],
    allowedRoles: [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.MANAGER],
    items: [
      { title: "Add Supplier", url: "/dashboard/suppliers/add" },
      { title: "All Suppliers", url: "/dashboard/suppliers" },
    ],
  },
  {
    title: "Communications",
    icon: "message",
    shortcut: ["g", "c"],
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
      UserRole.MANAGER,
      UserRole.ACCOUNTANT,
      UserRole.SALESPERSON,
    ],
    items: [
      { title: "Messages", url: "/dashboard/communications/messages" },
      {
        title: "Payment Reminders",
        url: "/dashboard/communications/reminders",
      },
      { title: "Staff Notifications", url: "/dashboard/communications/staff" },
    ],
  },
  {
    title: "Media",
    icon: "image",
    shortcut: ["g", "m"],
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
      UserRole.MANAGER,
      UserRole.ACCOUNTANT,
      UserRole.SALESPERSON,
    ],
    items: [
      { title: "Media Library", url: "/dashboard/media" },
      { title: "Upload Media", url: "/dashboard/media/upload" },
      { title: "Image Gallery", url: "/dashboard/media/images" },
      { title: "Video Gallery", url: "/dashboard/media/videos" },
      { title: "Documents", url: "/dashboard/media/documents", disabled: true },
    ],
  },
  {
    title: "Settings",
    icon: "settings",
    shortcut: ["g", "t"],
    allowedRoles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    items: [
      { title: "Business Settings", url: "/dashboard/settings" },
      { title: "Email Templates", url: "/dashboard/settings/email" },
      { title: "System Settings", url: "/dashboard/settings/system" },
    ],
  },

  {
    title: "Reports",
    icon: "barChart",
    shortcut: ["g", "r"],
    allowedRoles: [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.ACCOUNTANT],
    items: [
      { title: "Financial Reports", url: "/dashboard/reports/financial" },
      { title: "Sales Analytics", url: "/dashboard/reports/sales" },
      { title: "Inventory Reports", url: "/dashboard/reports/inventory" },
      { title: "Transaction History", url: "/dashboard/reports/transactions" },
    ],
  },
];
