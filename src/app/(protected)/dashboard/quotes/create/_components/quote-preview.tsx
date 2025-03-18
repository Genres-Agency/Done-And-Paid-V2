"use client";

import { QuoteFormValues } from "@/src/schema/quote";
import { Card } from "@/src/components/ui/card";
import { format } from "date-fns";
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

  return open ? (
    <Card
      className="p-8 transition-opacity duration-200 opacity-100"
      id="preview"
      onClick={() => onOpenChange(!open)}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between">
          <div className="space-y-2">
            {businessLogo && (
              <Image
                src={businessLogo}
                alt="Business Logo"
                width={120}
                height={60}
                className="object-contain"
              />
            )}
            <h2 className="text-2xl font-bold">{data.businessName}</h2>
            <div className="text-sm text-muted-foreground">
              <p>{data.businessAddress}</p>
              <p>{data.businessPhone}</p>
              <p>{data.businessEmail}</p>
              {data.businessWebsite && <p>{data.businessWebsite}</p>}
            </div>
          </div>
          <div className="text-right space-y-1">
            <h1 className="text-3xl font-bold">QUOTE</h1>
            {data.quoteNumber && (
              <p className="text-muted-foreground">#{data.quoteNumber}</p>
            )}
            <div className="text-sm text-muted-foreground mt-4">
              <p>Date: {data.quoteDate && format(data.quoteDate, "PP")}</p>
              <p>
                Valid Until: {data.validUntil && format(data.validUntil, "PP")}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Quote For:</h3>
          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="font-medium">{data.customerName}</p>
              <div className="text-sm text-muted-foreground">
                <p>{data.customerAddress}</p>
                <p>{data.customerPhone}</p>
                <p>{data.customerEmail}</p>
              </div>
            </div>
            {customerLogo && (
              <Image
                src={customerLogo}
                alt="Customer Logo"
                width={100}
                height={50}
                className="object-contain"
              />
            )}
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
              {data.items?.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">
                    {formatCurrency(item.unitPrice || 0)}
                  </td>
                  <td className="text-right py-2">
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

        {/* Totals Section */}
        <div className="mt-4 flex justify-end">
          <div className="w-1/3 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            {data.discountValue && data.discountValue > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Discount
                  {data.discountType === "percentage" &&
                    ` (${data.discountValue}%)`}
                  :
                </span>
                <span>-{formatCurrency(calculateDiscount())}</span>
              </div>
            )}
            {data.taxValue && data.taxValue > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Tax
                  {data.taxType === "percentage" && ` (${data.taxValue}%)`}:
                </span>
                <span>{formatCurrency(calculateTax())}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="mt-8 space-y-4">
          {data.notes && (
            <div>
              <h4 className="font-semibold mb-2">Notes</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {data.notes}
              </p>
            </div>
          )}
          {data.termsAndConditions && (
            <div>
              <h4 className="font-semibold mb-2">Terms & Conditions</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {data.termsAndConditions}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  ) : null;
}
