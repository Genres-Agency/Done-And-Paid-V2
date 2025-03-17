"use client";

import { ColumnDef } from "@tanstack/react-table";
import { QuoteWithCustomer } from "@/src/types/quote";
import { Button } from "@/src/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { formatDate } from "date-fns";

export const columns: ColumnDef<QuoteWithCustomer>[] = [
  {
    accessorKey: "quoteNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quote Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/quotes/${row.original.quoteNumber}`}
          className="text-primary hover:underline"
        >
          {row.original.quoteNumber}
        </Link>
      );
    },
  },
  {
    accessorKey: "customer.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: row.original.currency,
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
            ${status === "APPROVED" && "bg-green-100 text-green-800"}
            ${status === "PENDING" && "bg-yellow-100 text-yellow-800"}
            ${status === "REJECTED" && "bg-red-100 text-red-800"}
            ${status === "DRAFT" && "bg-gray-100 text-gray-800"}
            ${status === "CONVERTED" && "bg-blue-100 text-blue-800"}
            ${status === "EXPIRED" && "bg-purple-100 text-purple-800"}
          `}
        >
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "validUntil",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Valid Until
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatDate(row.getValue("validUntil")),
  },
];
