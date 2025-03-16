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
import { Separator } from "@/src/components/ui/separator";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./invoice-pdf";
import Image from "next/image";

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
      <DialogContent className="max-w-[850px] max-h-[95vh] flex flex-col overflow-hidden bg-gray-100 p-0">
        <DialogHeader className="sticky top-0 z-10 bg-white border-b px-4 py-2 shadow-sm">
          <DialogTitle className="text-lg">Invoice Preview</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div
            className="bg-white shadow-md mx-auto w-[21cm] min-h-[29.7cm] p-[1.5cm] print:p-0 print:shadow-none [&:not(:first-child)]:mt-8"
            style={{ breakAfter: "always" }}
          >
            <div className="space-y-8">
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {formValues.businessName}
                  </h2>
                  <p className="text-gray-600">{formValues.businessAddress}</p>
                  <p className="text-gray-600">{formValues.businessPhone}</p>
                  <p className="text-gray-600">{formValues.businessEmail}</p>
                </div>
                {businessLogo && (
                  <Image
                    src={businessLogo}
                    alt="Business Logo"
                    width={96}
                    height={96}
                    className="h-24 w-auto object-contain"
                    onError={(e) => {
                      console.error("Error loading business logo:", e);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>

              {/* Customer Information */}
              <div className="flex justify-between items-start gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Bill To:
                  </h3>
                  <p className="text-gray-600 font-medium">
                    {formValues.customerName}
                  </p>
                  <p className="text-gray-600">{formValues.customerAddress}</p>
                  <p className="text-gray-600">{formValues.customerPhone}</p>
                  <p className="text-gray-600">{formValues.customerEmail}</p>
                </div>
                {customerLogo && (
                  <Image
                    src={customerLogo}
                    alt="Customer Logo"
                    width={96}
                    height={96}
                    className="h-24 w-auto object-contain"
                    onError={(e) => {
                      console.error("Error loading customer logo:", e);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </div>

              {/* Invoice Details */}
              <div className="flex justify-between bg-white p-4 rounded-lg border">
                <div className="space-y-2">
                  <p className="text-gray-900">
                    <span className="font-medium">Invoice Number:</span>{" "}
                    {formValues.invoiceNumber}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Date:</span>{" "}
                    {format(formValues.invoiceDate, "PPP")}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Due Date:</span>{" "}
                    {format(formValues.dueDate, "PPP")}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mt-8 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Item
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">
                        Quantity
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">
                        Unit Price
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formValues.items.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{item.name}</td>
                        <td className="text-right py-3 px-4 text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-600">
                          {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-900 font-medium">
                          {(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="ml-auto w-72 space-y-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    {formValues.items
                      .reduce(
                        (sum, item) => sum + item.quantity * item.unitPrice,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                {formValues.discountValue > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Discount:</span>
                    <span className="font-medium text-red-600">
                      -{formValues.discountValue.toFixed(2)}%
                    </span>
                  </div>
                )}
                {formValues.taxValue > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax:</span>
                    <span className="font-medium">
                      +{formValues.taxValue.toFixed(2)}%
                    </span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total:</span>
                  <span>
                    {(() => {
                      const subtotal = formValues.items.reduce(
                        (sum, item) => sum + item.quantity * item.unitPrice,
                        0
                      );
                      const discountAmount = formValues.discountValue
                        ? (subtotal * formValues.discountValue) / 100
                        : 0;
                      const taxAmount = formValues.taxValue
                        ? ((subtotal - discountAmount) * formValues.taxValue) /
                          100
                        : 0;
                      return (subtotal - discountAmount + taxAmount).toFixed(2);
                    })()}
                  </span>
                </div>
              </div>

              {/* Notes & Terms */}
              {(formValues.notes || formValues.termsAndConditions) && (
                <div className="space-y-4 border-t pt-6">
                  {formValues.notes && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Notes:
                      </h3>
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {formValues.notes}
                      </p>
                    </div>
                  )}
                  {formValues.termsAndConditions && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Terms & Conditions:
                      </h3>
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {formValues.termsAndConditions}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="sticky bottom-0 z-10 bg-white border-t px-4 py-2 shadow-sm flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer className="mr-1.5 h-3.5 w-3.5" />
            Print
          </Button>
          <PDFDownloadLink
            document={
              <InvoicePDF
                formValues={formValues}
                businessLogo={businessLogo}
                customerLogo={customerLogo}
              />
            }
            fileName={`invoice-${formValues.invoiceNumber}.pdf`}
          >
            {({ loading, error }) => {
              if (error) {
                console.error("PDF generation error:", error);
                const errorMessage = error.message.includes("image")
                  ? "Failed to process images. Please ensure all images are valid and try again."
                  : "Failed to generate PDF. Please try again.";
                return (
                  <Button size="sm" variant="destructive" title={errorMessage}>
                    <X className="mr-1.5 h-3.5 w-3.5" />
                    {errorMessage}
                  </Button>
                );
              }
              return (
                <Button size="sm" variant="outline" disabled={loading}>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  {loading ? "Generating..." : "Download"}
                </Button>
              );
            }}
          </PDFDownloadLink>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
