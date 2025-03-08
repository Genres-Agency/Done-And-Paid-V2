"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/src/components/ui/badge";
import { Checkbox } from "@/src/components/ui/checkbox";
import { DataTableColumnHeader } from "../../../../_components/table/data-table-column-header";
import { BlogItem } from "./data/schema";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { EditBlogDialog } from "./edit-blog-dialog";
import { deleteBlog } from "../../blog-action";
import { format } from "date-fns";
import Image from "next/image";
import { updateBlog } from "../../blog-action";

// Define the type for your blog data
function StatusCell({ row }: { row: Row<BlogItem> }) {
  const [currentStatus, setCurrentStatus] = useState(row.original.status);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setCurrentStatus(newStatus);

      await updateBlog({
        id: row.original.id,
        status: newStatus as "PUBLISHED" | "PRIVATE" | "SCHEDULED",
      });

      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
      setCurrentStatus(row.original.status);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          style={{
            backgroundColor:
              currentStatus === "PUBLISHED"
                ? "#22c55e"
                : currentStatus === "PRIVATE"
                ? "#64748b"
                : "#eab308",
            color: "white",
          }}
        >
          <span className="sr-only">Open menu</span>
          {currentStatus}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleStatusChange("PUBLISHED")}>
          Set as Published
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("PRIVATE")}>
          Set as Private
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleStatusChange("SCHEDULED")}>
          Set as Scheduled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns = (categories: any[]): ColumnDef<BlogItem>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "titleEn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title (English)" />
    ),
  },
  {
    accessorKey: "titleBn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title (Bangla)" />
    ),
  },
  {
    accessorKey: "categoryEn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "media",
    header: "Media",
    cell: ({ row }) => {
      const media = row.original.media;
      if (!media) return null;

      return media.type === "IMAGE" ? (
        <div className="relative h-10 w-10">
          <Image
            src={media.url}
            alt="Blog media"
            fill
            className="rounded-md object-cover"
          />
        </div>
      ) : (
        <Badge>Video</Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <StatusCell row={row} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const handleDelete = async () => {
        try {
          await deleteBlog(row.original.id);
          toast.success("Blog deleted successfully");
        } catch (error) {
          toast.error("Failed to delete blog");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(row.original.id)}
            >
              Copy blog ID
            </DropdownMenuItem>
            <EditBlogDialog blog={row.original} categories={categories} />
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
