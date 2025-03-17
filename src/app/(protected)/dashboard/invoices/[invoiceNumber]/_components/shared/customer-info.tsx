import { InvoiceWithCustomer } from "@/src/types/invoice";

interface CustomerInfoProps {
  invoice: InvoiceWithCustomer;
}

export function CustomerInfo({ invoice }: CustomerInfoProps) {
  return (
    <div className="flex justify-between items-start gap-4 bg-muted p-4 rounded-lg">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">Bill To:</h3>
        <p className="text-muted-foreground font-medium">
          {invoice.customer.name}
        </p>
        <p className="text-muted-foreground">{invoice.customer.address}</p>
        <p className="text-muted-foreground">{invoice.customer.phoneNumber}</p>
        <p className="text-muted-foreground">{invoice.customer.email}</p>
      </div>
    </div>
  );
}
