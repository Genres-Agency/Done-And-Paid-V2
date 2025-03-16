import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { InvoiceFormValues } from "@/src/schema/invoice";

interface InvoicePDFProps {
  formValues: InvoiceFormValues;
  businessLogo?: string | null;
  customerLogo?: string | null;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "white",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  businessInfo: {
    flexDirection: "column",
  },
  businessName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111827",
  },
  businessDetails: {
    fontSize: 10,
    color: "#4B5563",
    marginBottom: 2,
  },
  customerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 4,
    marginBottom: 32,
  },
  customerInfo: {
    flexDirection: "column",
  },
  customerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#111827",
  },
  customerName: {
    fontSize: 12,
    fontWeight: "medium",
    marginBottom: 2,
    color: "#4B5563",
  },
  customerDetails: {
    fontSize: 10,
    color: "#4B5563",
    marginBottom: 2,
  },
  invoiceDetails: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 32,
  },
  invoiceInfo: {
    flexDirection: "row",
    marginBottom: 4,
  },
  invoiceLabel: {
    fontSize: 10,
    fontWeight: "medium",
    color: "#111827",
    width: 100,
  },
  invoiceValue: {
    fontSize: 10,
    color: "#4B5563",
  },
  table: {
    width: "100%",
    marginBottom: 32,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    padding: "12 16",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    padding: "12 16",
  },
  tableCell: {
    fontSize: 10,
  },
  itemCell: {
    flex: 3,
    color: "#111827",
  },
  quantityCell: {
    flex: 1,
    textAlign: "right",
    color: "#4B5563",
  },
  priceCell: {
    flex: 1,
    textAlign: "right",
    color: "#4B5563",
  },
  totalCell: {
    flex: 1,
    textAlign: "right",
    color: "#111827",
    fontWeight: "medium",
  },
  totalsSection: {
    width: 250,
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
    color: "#111827",
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  finalTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  notesSection: {
    marginTop: 32,
    marginBottom: 32,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  notesContent: {
    fontSize: 10,
    color: "#4B5563",
    lineHeight: 1.5,
  },
  termsSection: {
    marginBottom: 32,
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  termsContent: {
    fontSize: 10,
    color: "#4B5563",
    lineHeight: 1.5,
  },
});

export function InvoicePDF({
  formValues,
  businessLogo,
  customerLogo,
}: InvoicePDFProps) {
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
  const total = subtotal - discountAmount + taxAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>{formValues.businessName}</Text>
            <Text style={styles.businessDetails}>
              {formValues.businessAddress}
            </Text>
            <Text style={styles.businessDetails}>
              {formValues.businessPhone}
            </Text>
            <Text style={styles.businessDetails}>
              {formValues.businessEmail}
            </Text>
          </View>
          {businessLogo && (
            <Image
              src={businessLogo}
              style={{ width: 96, height: 96, objectFit: "contain" }}
            />
          )}
        </View>

        <View style={styles.customerSection}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerTitle}>Bill To:</Text>
            <Text style={styles.customerName}>{formValues.customerName}</Text>
            <Text style={styles.customerDetails}>
              {formValues.customerAddress}
            </Text>
            <Text style={styles.customerDetails}>
              {formValues.customerPhone}
            </Text>
            <Text style={styles.customerDetails}>
              {formValues.customerEmail}
            </Text>
          </View>
          {customerLogo && (
            <Image
              src={customerLogo}
              style={{ width: 96, height: 96, objectFit: "contain" }}
            />
          )}
        </View>

        <View style={styles.invoiceDetails}>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceLabel}>Invoice Number:</Text>
            <Text style={styles.invoiceValue}>{formValues.invoiceNumber}</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceLabel}>Date:</Text>
            <Text style={styles.invoiceValue}>
              {formValues.invoiceDate.toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceLabel}>Due Date:</Text>
            <Text style={styles.invoiceValue}>
              {formValues.dueDate.toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.itemCell]}>Item</Text>
            <Text style={[styles.tableCell, styles.quantityCell]}>
              Quantity
            </Text>
            <Text style={[styles.tableCell, styles.priceCell]}>Unit Price</Text>
            <Text style={[styles.tableCell, styles.totalCell]}>Total</Text>
          </View>
          {formValues.items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCell, styles.itemCell]}>
                {item.name}
              </Text>
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

        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{subtotal.toFixed(2)}</Text>
          </View>
          {formValues.discountValue > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={[styles.totalValue, { color: "#DC2626" }]}>
                -{formValues.discountValue}%
              </Text>
            </View>
          )}
          {formValues.taxValue > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax:</Text>
              <Text style={styles.totalValue}>+{formValues.taxValue}%</Text>
            </View>
          )}
          <View style={styles.finalTotal}>
            <Text style={styles.finalTotalLabel}>Total:</Text>
            <Text style={styles.finalTotalValue}>{total.toFixed(2)}</Text>
          </View>
        </View>

        {formValues.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesContent}>{formValues.notes}</Text>
          </View>
        )}

        {formValues.termsAndConditions && (
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Terms & Conditions</Text>
            <Text style={styles.termsContent}>
              {formValues.termsAndConditions}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
