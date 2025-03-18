"use client";

import { ColumnDef } from "@tanstack/react-table";
import { QuoteWithCustomer } from "@/src/types/quote";
import { Button } from "@/src/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { formatDate } from "date-fns";
import { DataTableColumnHeader } from "@/src/app/(protected)/_components/table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("total") as number;
      return <div className="font-medium">${amount.toFixed(2)}</div>;
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
          W Valid Until
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatDate(row.getValue("validUntil"), "MMM dd, yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const quote = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => window.location.href = `/dashboard/quotes/${quote.quoteNumber}/edit`}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.location.href = `/dashboard/quotes/${quote.quoteNumber}/update`}
            >
              Update
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this quote?')) {
                  // TODO: Implement delete functionality
                  console.log('Delete quote:', quote.quoteNumber);
                }
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
