import { Row } from "@tanstack/react-table";
import { Invoice } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";

type InvoiceWithCustomer = Invoice & {
  customer: {
    name: string;
  };
};

interface InvoiceDetailsDialogProps {
  row: Row<InvoiceWithCustomer>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetailsDialog({
  row,
  open,
  onOpenChange,
}: InvoiceDetailsDialogProps) {
  const invoice = row.original;
  const date = new Date(invoice.dueDate);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Invoice Details</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Invoice Information</h3>
            <div className="mt-2 space-y-2">
              <p>
                <span className="font-medium">Invoice Number:</span>{" "}
                {invoice.invoiceNumber}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {invoice.paymentStatus}
              </p>
              <p>
                <span className="font-medium">Due Date:</span>{" "}
                {date.toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Customer Information</h3>
            <div className="mt-2 space-y-2">
              <p>
                <span className="font-medium">Customer:</span>{" "}
                {invoice.customer?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Amount:</span> $
                {invoice.total.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Notes:</span>{" "}
                {invoice.notes || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
