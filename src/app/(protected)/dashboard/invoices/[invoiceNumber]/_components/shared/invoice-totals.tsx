import { InvoiceWithCustomer } from "@/src/types/invoice";
import { Separator } from "@/src/components/ui/separator";

interface InvoiceTotalsProps {
  invoice: InvoiceWithCustomer;
}

export function InvoiceTotals({ invoice }: InvoiceTotalsProps) {
  const subtotal = invoice.InvoiceItem.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const discountAmount = invoice.discountValue
    ? (subtotal * invoice.discountValue) / 100
    : 0;
  const taxAmount = invoice.taxValue
    ? ((subtotal - discountAmount) * invoice.taxValue) / 100
    : 0;
  const total = subtotal - discountAmount + taxAmount;

  return (
    <div className="ml-auto w-72 space-y-2 bg-muted p-4 rounded-lg">
      <div className="flex justify-between text-muted-foreground">
        <span>Subtotal:</span>
        <span className="font-medium">{subtotal.toFixed(2)}</span>
      </div>
      {invoice.discountValue > 0 && (
        <div className="flex justify-between text-muted-foreground">
          <span>Discount:</span>
          <span className="font-medium text-destructive">
            -{invoice.discountValue.toFixed(2)}%
          </span>
        </div>
      )}
      {invoice.taxValue > 0 && (
        <div className="flex justify-between text-muted-foreground">
          <span>Tax:</span>
          <span className="font-medium">{invoice.taxValue.toFixed(2)}%</span>
        </div>
      )}
      <Separator className="my-2" />
      <div className="flex justify-between text-lg font-bold text-foreground">
        <span>Total:</span>
        <span>{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
