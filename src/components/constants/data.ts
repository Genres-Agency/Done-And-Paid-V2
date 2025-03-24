import { NavItem } from "@/src/types";
import { UserRole, BusinessType } from "@prisma/client";

export const navItems: NavItem[] = [
  // Common features for all business types
  {
    title: "Business Overview",
    url: "/dashboard/overview",
    icon: "dashboard",
    shortcut: ["g", "d"],
  },
  // Retail-specific features
  {
    title: "Point of Sale",
    icon: "store",
    shortcut: ["g", "s"],
    allowedBusinessTypes: [BusinessType.RETAIL],
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
      UserRole.MANAGER,
      UserRole.SALESPERSON,
    ],
    items: [
      { title: "New Sale", url: "/dashboard/pos/new", disabled: true },
      { title: "Sales History", url: "/dashboard/pos/history", disabled: true },
      {
        title: "Cash Register",
        url: "/dashboard/pos/register",
        disabled: true,
      },
    ],
  },
  // Wholesale-specific features
  {
    title: "Bulk Orders",
    icon: "package",
    shortcut: ["g", "b"],
    allowedBusinessTypes: [BusinessType.WHOLESALE],
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
      UserRole.MANAGER,
      UserRole.SALESPERSON,
    ],
    items: [
      {
        title: "New Bulk Order",
        url: "/dashboard/bulk-orders/new",
        disabled: true,
      },
      {
        title: "Order History",
        url: "/dashboard/bulk-orders/history",
        disabled: true,
      },
      {
        title: "Price Lists",
        url: "/dashboard/bulk-orders/price-lists",
        disabled: true,
      },
    ],
  },
  // Manufacturing-specific features
  {
    title: "Production",
    icon: "factory",
    shortcut: ["g", "m"],
    allowedBusinessTypes: [BusinessType.MANUFACTURING],
    allowedRoles: [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.MANAGER],
    items: [
      {
        title: "Production Orders",
        url: "/dashboard/production/orders",
        disabled: true,
      },
      {
        title: "Bill of Materials",
        url: "/dashboard/production/bom",
        disabled: true,
      },
      {
        title: "Work Orders",
        url: "/dashboard/production/work-orders",
        disabled: true,
      },
    ],
  },
  // Service-specific features
  {
    title: "Services",
    icon: "tool",
    shortcut: ["g", "v"],
    allowedBusinessTypes: [BusinessType.SERVICE],
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
      UserRole.MANAGER,
      UserRole.SALESPERSON,
    ],
    items: [
      {
        title: "Service Bookings",
        url: "/dashboard/services/bookings",
        disabled: true,
      },
      {
        title: "Service Catalog",
        url: "/dashboard/services/catalog",
        disabled: true,
      },
      {
        title: "Time Tracking",
        url: "/dashboard/services/time-tracking",
        disabled: true,
      },
    ],
  },
  {
    title: "Projects",
    icon: "briefcase",
    shortcut: ["g", "j"],
    allowedBusinessTypes: [BusinessType.SERVICE],
    allowedRoles: [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.MANAGER],
    items: [
      { title: "All Projects", url: "/dashboard/projects" },
      {
        title: "Project Submissions",
        url: "/dashboard/project-submission",
        disabled: true,
      },
    ],
  },
  {
    title: "Invoices",
    icon: "file",
    // url: "/dashboard/invoices",
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
      {
        title: "Pending Payments",
        url: "/dashboard/invoices/pending",
        disabled: true,
      },
      {
        title: "Payment History",
        url: "/dashboard/invoices/payments",
        disabled: true,
      },
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
      {
        title: "Pending Quotes",
        url: "/dashboard/quotes/pending",
        disabled: true,
      },
      {
        title: "Expired Quotes",
        url: "/dashboard/quotes/expired",
        disabled: true,
      },
    ],
  },
  {
    title: "Products",
    icon: "package",
    url: "/dashboard/products",
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
      {
        title: "Add Customer",
        url: "/dashboard/customers/add",
        disabled: true,
      },
      { title: "All Customers", url: "/dashboard/customers", disabled: true },
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
      {
        title: "Messages",
        url: "/dashboard/communications/messages",
        disabled: true,
      },
      {
        title: "Payment Reminders",
        url: "/dashboard/communications/reminders",
        disabled: true,
      },
      {
        title: "Staff Notifications",
        url: "/dashboard/communications/staff",
        disabled: true,
      },
    ],
  },
  // {
  //   title: "Media",
  //   icon: "image",
  //   shortcut: ["g", "m"],
  //   allowedRoles: [
  //     UserRole.ADMIN,
  //     UserRole.SUPERADMIN,
  //     UserRole.MANAGER,
  //     UserRole.ACCOUNTANT,
  //     UserRole.SALESPERSON,
  //   ],
  //   items: [
  //     { title: "Media Library", url: "/dashboard/media" },
  //     { title: "Upload Media", url: "/dashboard/media/upload" },
  //     { title: "Image Gallery", url: "/dashboard/media/images" },
  //     { title: "Video Gallery", url: "/dashboard/media/videos" },
  //     { title: "Documents", url: "/dashboard/media/documents", disabled: true },
  //   ],
  // },
  {
    title: "Reports",
    icon: "barChart",
    shortcut: ["g", "r"],
    allowedRoles: [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.ACCOUNTANT],
    items: [
      {
        title: "Financial Reports",
        url: "/dashboard/reports/financial",
        disabled: true,
      },
      {
        title: "Sales Analytics",
        url: "/dashboard/reports/sales",
        disabled: true,
      },
      {
        title: "Inventory Reports",
        url: "/dashboard/reports/inventory",
        disabled: true,
      },
      {
        title: "Transaction History",
        url: "/dashboard/reports/transactions",
        disabled: true,
      },
    ],
  },
  {
    title: "Settings",
    icon: "settings",
    shortcut: ["g", "t"],
    url: "/dashboard/settings",
    allowedRoles: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
];
