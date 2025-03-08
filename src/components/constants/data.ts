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
    title: "Appointments",
    icon: "calendar",
    shortcut: ["g", "a"],
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
      UserRole.DENTIST,
      UserRole.STAFF,
    ],
    items: [
      { title: "All Appointments", url: "/dashboard/appointments" },
      {
        title: "Wating",
        url: "/dashboard/appointments/waiting-list",
        disabled: true,
      },
      {
        title: "Complited",
        url: "/dashboard/appointments/complited",
        disabled: true,
      },
      {
        title: "Calendar View",
        url: "/dashboard/appointments/calendar",
        disabled: true,
      },
    ],
  },
  {
    title: "Patients",
    icon: "users",
    shortcut: ["g", "p"],
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
      UserRole.DENTIST,
      UserRole.STAFF,
    ],
    items: [
      { title: "All Patients", url: "/dashboard/patients" },
      { title: "Add Patient", url: "/dashboard/patients/add" },
      { title: "Medical Records", url: "/dashboard/patients/records" },
    ],
  },
  {
    title: "Services",
    icon: "service",
    shortcut: ["g", "v"],
    allowedRoles: [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.DENTIST],
    items: [
      { title: "Add Service", url: "/dashboard/services/post-service" },
      { title: "All Services", url: "/dashboard/services" },
      {
        title: "Treatment Plans",
        url: "/dashboard/services/treatments",
        disabled: true,
      },
    ],
  },
  {
    title: "Blogs & Articles",
    icon: "blog",
    shortcut: ["g", "i"],
    allowedRoles: [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.DENTIST],
    items: [
      { title: "Add Blog", url: "/dashboard/blog/add" },
      { title: "All Blogs", url: "/dashboard/blog" },
      {
        title: "Blog Categories",
        url: "/dashboard/blog/categories",
        disabled: true,
      },
    ],
  },
  {
    title: "User Management",
    icon: "staff",
    shortcut: ["g", "s"],
    allowedRoles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    items: [
      { title: "Add User", url: "/dashboard/users/add-user" },
      { title: "All User", url: "/dashboard/users" },
      { title: "All Patient", url: "/dashboard/users/patient" },
      { title: "All Dentist", url: "/dashboard/users/dentist" },
      { title: "Admins", url: "/dashboard/users/admins" },
    ],
  },
  {
    title: "Reports",
    icon: "chart",
    shortcut: ["g", "r"],
    allowedRoles: [UserRole.ADMIN, UserRole.SUPERADMIN],
    items: [
      { title: "Financial Reports", url: "/dashboard/reports/financial" },
      { title: "Patient Statistics", url: "/dashboard/reports/patients" },
      { title: "Treatment Analytics", url: "/dashboard/reports/treatments" },
      { title: "Performance Metrics", url: "/dashboard/reports/performance" },
    ],
  },
  {
    title: "Communications",
    icon: "message",
    shortcut: ["g", "c"],
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
      UserRole.DENTIST,
      UserRole.STAFF,
    ],
    items: [
      { title: "Patient Messages", url: "/dashboard/communications/messages" },
      {
        title: "Appointment Reminders",
        url: "/dashboard/communications/reminders",
      },
      { title: "Staff Notifications", url: "/dashboard/communications/staff" },
    ],
  },
  {
    title: "Media",
    icon: "media",
    shortcut: ["g", "m"],
    allowedRoles: [
      UserRole.ADMIN,
      UserRole.SUPERADMIN,
      UserRole.DENTIST,
      UserRole.STAFF,
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
      { title: "Clinic Settings", url: "/dashboard/settings" },
      { title: "Email Templates", url: "/dashboard/settings/email" },
      { title: "System Settings", url: "/dashboard/settings/system" },
    ],
  },
];
