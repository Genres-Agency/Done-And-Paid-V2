import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/src/components/ui/button";
import { Download } from "lucide-react";
import { InvoicePDF } from "./invoice-pdf";
import { InvoiceFormValues } from "@/src/schema/invoice";

export function TestPDFPage() {
  // Mock logo URLs for testing using base64 encoded 1x1 pixel images
  const mockBusinessLogo =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const mockCustomerLogo =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

  // Mock form values for testing
  const mockFormValues: InvoiceFormValues = {
    businessName: "Test Business",
    businessAddress: "123 Test St",
    businessPhone: "123-456-7890",
    businessEmail: "test@business.com",
    customerName: "Test Customer",
    customerEmail: "customer@test.com",
    customerPhone: "098-765-4321",
    customerAddress: "456 Customer St",
    invoiceDate: new Date(),
    dueDate: new Date(),
    items: [
      {
        name: "Test Item",
        quantity: 1,
        unitPrice: 100,
      },
    ],
    currency: "USD",
    discountType: "percentage",
    discountValue: 0,
    taxType: "percentage",
    taxValue: 0,
    paidAmount: 0,
    installmentOption: false,
    paymentMethod: "CASH",
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test PDF Download</h1>
      <PDFDownloadLink
        document={
          <InvoicePDF
            formValues={mockFormValues}
            businessLogo={mockBusinessLogo}
            customerLogo={mockCustomerLogo}
          />
        }
        fileName="test-document.pdf"
      >
        {({ loading, error }) => {
          if (error) {
            console.error("PDF generation error:", error);
            return (
              <Button variant="destructive" title={error.message}>
                Failed to generate PDF
              </Button>
            );
          }
          return (
            <Button variant="outline" disabled={loading}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              {loading ? "Generating..." : "Download Test PDF"}
            </Button>
          );
        }}
      </PDFDownloadLink>
    </div>
  );
}
