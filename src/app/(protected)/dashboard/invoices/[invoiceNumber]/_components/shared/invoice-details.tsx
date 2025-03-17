import { InvoiceWithCustomer } from "@/src/types/invoice";

interface InvoiceDetailsProps {
  invoice: InvoiceWithCustomer;
}

export function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  const dueDate = new Date(invoice.dueDate);

  return (
    <div className="flex justify-between bg-muted p-4 rounded-lg border">
      <div className="space-y-2">
        <p className="text-foreground">
          <span className="font-medium">Invoice Number:</span>{" "}
          {invoice.invoiceNumber}
        </p>
        <p className="text-foreground">
          <span className="font-medium">Date:</span>{" "}
          {new Date(invoice.createdAt).toLocaleDateString()}
        </p>
        <p className="text-foreground">
          <span className="font-medium">Due Date:</span>{" "}
          {dueDate.toLocaleDateString()}
        </p>
        <p className="text-foreground">
          <span className="font-medium">Status:</span> {invoice.paymentStatus}
        </p>
      </div>
    </div>
  );
}
