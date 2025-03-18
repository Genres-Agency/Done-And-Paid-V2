"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Printer, Download, X } from "lucide-react";
import { QuoteFormValues } from "@/src/schema/quote";
import { format } from "date-fns";
import { Separator } from "@/src/components/ui/separator";
import Image from "next/image";

interface QuotePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formValues: QuoteFormValues;
  businessLogo: string | null;
  customerLogo: string | null;
}

export function QuotePreview({
  open,
  onOpenChange,
  formValues: data,
  businessLogo,
  customerLogo,
}: QuotePreviewProps) {
  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateSubtotal = () => {
    return (
      data.items?.reduce(
        (sum, item) =>
          sum + calculateItemTotal(item.quantity || 0, item.unitPrice || 0),
        0
      ) || 0
    );
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (data.discountType === "percentage") {
      return (subtotal * (data.discountValue || 0)) / 100;
    }
    return data.discountValue || 0;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const taxableAmount = subtotal - discount;

    if (data.taxType === "percentage") {
      return (taxableAmount * (data.taxValue || 0)) / 100;
    }
    return data.taxValue || 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: data.currency || "USD",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[850px] max-h-[95vh] flex flex-col overflow-hidden bg-gray-100 p-0">
        <DialogHeader className="sticky top-0 z-10 bg-white border-b px-4 py-2 shadow-sm">
          <DialogTitle className="text-lg">Quote Preview</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div
            className="bg-white shadow-md mx-auto w-[21cm] min-h-[29.7cm] p-[1.5cm] print:p-0 print:shadow-none [&:not(:first-child)]:mt-8"
            style={{ breakAfter: "always" }}
          >
            <div className="space-y-8">
              {/* Header Section */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {data.businessName}
                  </h2>
                  <p className="text-gray-600">{data.businessAddress}</p>
                  <p className="text-gray-600">{data.businessPhone}</p>
                  <p className="text-gray-600">{data.businessEmail}</p>
                  {data.businessTaxNumber && (
                    <p className="text-gray-600">
                      Tax Number: {data.businessTaxNumber}
                    </p>
                  )}
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

              {/* Quote Information */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-700">Quote Details</h3>
                  <p className="text-gray-600">
                    Date: {format(new Date(data.quoteDate), "MMMM dd, yyyy")}
                  </p>
                  <p className="text-gray-600">
                    Valid Until:{" "}
                    {format(new Date(data.validUntil), "MMMM dd, yyyy")}
                  </p>
                  {data.referenceNumber && (
                    <p className="text-gray-600">Ref: {data.referenceNumber}</p>
                  )}
                  <p className="text-gray-600">Status: {data.status}</p>
                </div>

                {/* Customer Information */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-700">Quote To:</h3>
                      <p className="text-gray-900 font-medium">
                        {data.customerName}
                      </p>
                      <p className="text-gray-600">{data.customerAddress}</p>
                      <p className="text-gray-600">{data.customerPhone}</p>
                      <p className="text-gray-600">{data.customerEmail}</p>
                      {data.billingAddress && (
                        <>
                          <h4 className="font-semibold text-gray-700 mt-2">
                            Billing Address:
                          </h4>
                          <p className="text-gray-600 whitespace-pre-line">
                            {data.billingAddress}
                          </p>
                        </>
                      )}
                      {data.shippingAddress && (
                        <>
                          <h4 className="font-semibold text-gray-700 mt-2">
                            Shipping Address:
                          </h4>
                          <p className="text-gray-600 whitespace-pre-line">
                            {data.shippingAddress}
                          </p>
                        </>
                      )}
                    </div>
                    {customerLogo && (
                      <Image
                        src={customerLogo}
                        alt="Customer Logo"
                        width={64}
                        height={64}
                        className="h-16 w-auto object-contain"
                        onError={(e) => {
                          console.error("Error loading customer logo:", e);
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mt-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-4 text-left border-b">Item</th>
                      <th className="py-2 px-4 text-left border-b">
                        Description
                      </th>
                      <th className="py-2 px-4 text-right border-b">
                        Quantity
                      </th>
                      <th className="py-2 px-4 text-right border-b">
                        Unit Price
                      </th>
                      <th className="py-2 px-4 text-right border-b">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items?.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4">{item.description}</td>
                        <td className="py-2 px-4 text-right">
                          {item.quantity}
                        </td>
                        <td className="py-2 px-4 text-right">
                          {formatCurrency(item.unitPrice || 0)}
                        </td>
                        <td className="py-2 px-4 text-right">
                          {formatCurrency(
                            calculateItemTotal(
                              item.quantity || 0,
                              item.unitPrice || 0
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-8 flex justify-end">
                <div className="w-72 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  {data.discountValue > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>
                        Discount
                        {data.discountType === "percentage"
                          ? ` (${data.discountValue}%)`
                          : ""}
                        :
                      </span>
                      <span>-{formatCurrency(calculateDiscount())}</span>
                    </div>
                  )}
                  {data.taxValue > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>
                        Tax
                        {data.taxType === "percentage"
                          ? ` (${data.taxValue}%)`
                          : ""}
                        :
                      </span>
                      <span>{formatCurrency(calculateTax())}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              {/* Notes & Terms */}
              {(data.notes || data.termsAndConditions) && (
                <div className="mt-8 space-y-4">
                  {data.notes && (
                    <div>
                      <h3 className="font-semibold text-gray-700">Notes:</h3>
                      <p className="text-gray-600 whitespace-pre-line mt-1">
                        {data.notes}
                      </p>
                    </div>
                  )}
                  {data.termsAndConditions && (
                    <div>
                      <h3 className="font-semibold text-gray-700">
                        Terms and Conditions:
                      </h3>
                      <p className="text-gray-600 whitespace-pre-line mt-1">
                        {data.termsAndConditions}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="sticky bottom-0 z-10 bg-white border-t px-4 py-2 shadow-sm">
          <div className="flex justify-end w-full">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
