import { InvoiceFormValues } from "@/src/schema/invoice";
import { format } from "date-fns";
import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2", fontWeight: 500 },
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2", fontWeight: 700 }
  ]
});

interface InvoicePDFProps {
  formValues: InvoiceFormValues;
  businessLogo: string | null;
  customerLogo: string | null;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "white",
    fontFamily: "Inter"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  businessInfo: {
    flexDirection: "column",
  },
  businessName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  businessDetails: {
    fontSize: 10,
    color: "#4B5563",
    marginBottom: 2,
  },
  logo: {
    width: 100,
    height: 100,
    objectFit: "contain",
  },
  customerSection: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 4,
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  customerInfo: {
    flexDirection: "column",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  customerName: {
    fontSize: 12,
    fontWeight: "medium",
    marginBottom: 2,
  },
  customerDetails: {
    fontSize: 10,
    color: "#4B5563",
    marginBottom: 2,
  },
  invoiceDetails: {
    border: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    borderRadius: 4,
    marginBottom: 30,
  },
  invoiceInfo: {
    flexDirection: "row",
    marginBottom: 4,
  },
  invoiceLabel: {
    fontSize: 10,
    fontWeight: "medium",
    width: 100,
  },
  invoiceValue: {
    fontSize: 10,
    color: "#4B5563",
  },
  table: {
    flexDirection: "column",
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    padding: 8,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    padding: 8,
  },
  tableCell: {
    fontSize: 10,
  },
  itemCell: {
    flex: 3,
  },
  quantityCell: {
    flex: 1,
    textAlign: "right",
  },
  priceCell: {
    flex: 1,
    textAlign: "right",
  },
  totalCell: {
    flex: 1,
    textAlign: "right",
  },
  totalsSection: {
    width: 200,
    alignSelf: "flex-end",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: "#4B5563",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "medium",
  },
  finalTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  finalTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  finalTotalValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  notesSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 16,
  },
  noteBox: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 10,
    color: "#4B5563",
  },
});

export function InvoicePDF({ formValues, businessLogo, customerLogo }: InvoicePDFProps) {
  const calculateTotal = () => {
    const subtotal = formValues.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const discountAmount = formValues.discountValue
      ? (subtotal * formValues.discountValue) / 100
      : 0;
    const taxAmount = formValues.taxValue
      ? ((subtotal - discountAmount) * formValues.taxValue) / 100
      : 0;
    return (subtotal - discountAmount + taxAmount).toFixed(2);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{formValues.businessName}</Text>
            <Text style={styles.businessDetails}>{formValues.businessAddress}</Text>
            <Text style={styles.businessDetails}>{formValues.businessPhone}</Text>
            <Text style={styles.businessDetails}>{formValues.businessEmail}</Text>
          </View>
          {businessLogo && <Image style={styles.logo} src={businessLogo} />}
        </View>

        {/* Customer Information */}
        <View style={styles.customerSection}>
          <View style={styles.customerInfo}>
            <Text style={styles.sectionTitle}>Bill To:</Text>
            <Text style={styles.customerName}>{formValues.customerName}</Text>
            <Text style={styles.customerDetails}>{formValues.customerAddress}</Text>
            <Text style={styles.customerDetails}>{formValues.customerPhone}</Text>
            <Text style={styles.customerDetails}>{formValues.customerEmail}</Text>
          </View>
          {customerLogo && <Image style={styles.logo} src={customerLogo} />}
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceLabel}>Invoice Number:</Text>
            <Text style={styles.invoiceValue}>{formValues.invoiceNumber}</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceLabel}>Date:</Text>
            <Text style={styles.invoiceValue}>
              {format(formValues.invoiceDate, "PPP")}
            </Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceLabel}>Due Date:</Text>
            <Text style={styles.invoiceValue}>
              {format(formValues.dueDate, "PPP")}
            </Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.itemCell]}>Item</Text>
            <Text style={[styles.tableCell, styles.quantityCell]}>Quantity</Text>
            <Text style={[styles.tableCell, styles.priceCell]}>Unit Price</Text>
            <Text style={[styles.tableCell, styles.totalCell]}>Total</Text>
          </View>
          {formValues.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.itemCell]}>{item.name}</Text>
              <Text style={[styles.tableCell, styles.quantityCell]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCell, styles.priceCell]}>
                {item.unitPrice.toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, styles.totalCell]}>
                {(item.quantity * item.unitPrice).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>
              {formValues.items
                .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                .toFixed(2)}
            </Text>
          </View>
          {formValues.discountValue > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={[styles.totalValue, { color: "#DC2626" }]}>
                -{formValues.discountValue.toFixed(2)}%
              </Text>
            </View>
          )}
          {formValues.taxValue > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax:</Text>
              <Text style={styles.totalValue}>
                +{formValues.taxValue.toFixed(2)}%
              </Text>
            </View>
          )}
          <View style={styles.finalTotal}>
            <Text style={styles.finalTotalLabel}>Total:</Text>
            <Text style={styles.finalTotalValue}>{calculateTotal()}</Text>
          </View>
        </View>

        {/* Notes & Terms */}
        {(formValues.notes || formValues.termsAndConditions) && (
          <View style={styles.notesSection}>
            {formValues.notes && (
              <View style={styles.noteBox}>
                <Text style={styles.noteTitle}>Notes:</Text>
                <Text style={styles.noteText}>{formValues.notes}</Text>
              </View>
            )}
            {formValues.termsAndConditions && (
              <View style={styles.noteBox}>
                <Text style={styles.noteTitle}>Terms & Conditions:</Text>
                <Text style={styles.noteText}>{formValues.termsAndConditions}</Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}