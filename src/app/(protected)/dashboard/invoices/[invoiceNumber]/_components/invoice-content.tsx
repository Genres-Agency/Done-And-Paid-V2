import { InvoiceWithCustomer } from "@/src/types/invoice";
import { BusinessInfo } from "./shared/business-info";
import { CustomerInfo } from "./shared/customer-info";
import { InvoiceDetails } from "./shared/invoice-details";
import { InvoiceItems } from "./shared/invoice-items";
import { InvoiceTotals } from "./shared/invoice-totals";

interface InvoiceContentProps {
  invoice: InvoiceWithCustomer;
}

export function InvoiceContent({ invoice }: InvoiceContentProps) {
  return (
    <div className="space-y-8 bg-background p-8 rounded-lg shadow-sm">
      <BusinessInfo invoice={invoice} />
      <CustomerInfo invoice={invoice} />
      <InvoiceDetails invoice={invoice} />
      <InvoiceItems invoice={invoice} />
      <InvoiceTotals invoice={invoice} />
      {invoice.notes && (
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-2">Notes:</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {invoice.notes}
          </p>
        </div>
      )}
    </div>
  );
}
