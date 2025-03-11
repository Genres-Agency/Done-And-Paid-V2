import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Printer, Download, X } from "lucide-react";
import { InvoiceFormValues } from "@/src/schema/invoice";
import { format } from "date-fns";
import { PaymentMethod } from "@prisma/client";
import { Separator } from "@/src/components/ui/separator";

interface InvoicePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formValues: InvoiceFormValues;
  businessLogo: string | null;
  customerLogo: string | null;
}

export function InvoicePreview({
  open,
  onOpenChange,
  formValues,
  businessLogo,
  customerLogo,
}: InvoicePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between">
            <div>
              <h2 className="text-2xl font-bold">{formValues.businessName}</h2>
              <p>{formValues.businessAddress}</p>
              <p>{formValues.businessPhone}</p>
              <p>{formValues.businessEmail}</p>
            </div>
            {businessLogo && (
              <img
                src={businessLogo}
                alt="Business Logo"
                className="h-20 w-auto"
              />
            )}
          </div>

          {/* Customer Information */}
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold">Bill To:</h3>
              <p>{formValues.customerName}</p>
              <p>{formValues.customerAddress}</p>
              <p>{formValues.customerPhone}</p>
              <p>{formValues.customerEmail}</p>
            </div>
            {customerLogo && (
              <img
                src={customerLogo}
                alt="Customer Logo"
                className="h-20 w-auto"
              />
            )}
          </div>

          {/* Invoice Details */}
          <div className="flex justify-between">
            <div>
              <p>Invoice Number: {formValues.invoiceNumber}</p>
              <p>Date: {format(formValues.invoiceDate, "PPP")}</p>
              <p>Due Date: {format(formValues.dueDate, "PPP")}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-8">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Unit Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {formValues.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">
                      {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="text-right py-2">
                      {(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="ml-auto w-64">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>
                {formValues.items
                  .reduce(
                    (sum, item) => sum + item.quantity * item.unitPrice,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            {formValues.discount && formValues.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>{formValues.discount.toFixed(2)}%</span>
              </div>
            )}
            {typeof formValues.tax === "number" && formValues.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formValues.tax.toFixed(2)}%</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>
                {(() => {
                  const subtotal = formValues.items.reduce(
                    (sum, item) => sum + item.quantity * item.unitPrice,
                    0
                  );
                  const discountAmount = formValues.discount
                    ? (subtotal * formValues.discount) / 100
                    : 0;
                  const taxAmount = formValues.tax
                    ? ((subtotal - discountAmount) * formValues.tax) / 100
                    : 0;
                  return (subtotal - discountAmount + taxAmount).toFixed(2);
                })()}
              </span>
            </div>
          </div>

          {/* Notes & Terms */}
          {formValues.notes && (
            <div>
              <h3 className="font-semibold">Notes:</h3>
              <p>{formValues.notes}</p>
            </div>
          )}
          {formValues.termsAndConditions && (
            <div>
              <h3 className="font-semibold">Terms & Conditions:</h3>
              <p>{formValues.termsAndConditions}</p>
            </div>
          )}
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
