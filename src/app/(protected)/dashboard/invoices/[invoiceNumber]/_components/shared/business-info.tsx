import { InvoiceWithCustomer } from "@/src/types/invoice";

interface BusinessInfoProps {
  invoice: InvoiceWithCustomer;
}

export function BusinessInfo({ invoice }: BusinessInfoProps) {
  return (
    <div className="flex justify-between items-start gap-4 p-6 bg-muted rounded-lg">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          {invoice.businessName}
        </h2>
        <div className="space-y-1 text-muted-foreground">
          <p className="flex items-center gap-2">
            <span className="font-medium">Address:</span>{" "}
            {invoice.businessAddress}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium">Phone:</span> {invoice.businessPhone}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium">Email:</span> {invoice.businessEmail}
          </p>
        </div>
      </div>
    </div>
  );
}
