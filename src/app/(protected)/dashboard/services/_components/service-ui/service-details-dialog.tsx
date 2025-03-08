"use client";

import { Row } from "@tanstack/react-table";
import { ServiceItem } from "./data/data";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";

interface ServiceDetailsDialogProps {
  row: Row<ServiceItem>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceDetailsDialog({
  row,
  open,
  onOpenChange,
}: ServiceDetailsDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Service Details</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Title (English):</span>
            <span className="col-span-3">{row.original.titleEn}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Title (Bangla):</span>
            <span className="col-span-3">{row.original.titleBn}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Description (English):</span>
            <span className="col-span-3">{row.original.descriptionEn}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Description (Bangla):</span>
            <span className="col-span-3">{row.original.descriptionBn}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Price:</span>
            <span className="col-span-3">৳{row.original.price.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Duration:</span>
            <span className="col-span-3">{row.original.duration}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Status:</span>
            <span className="col-span-3">
              <div
                className={`inline-block text-center font-medium rounded-full px-2.5 py-1 text-xs ${
                  row.original.status === "PRIVATE"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {row.original.status}
              </div>
            </span>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
