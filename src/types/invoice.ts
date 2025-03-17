import {
  Invoice,
  Customer,
  User,
  Payment,
  InvoiceItem,
  Product,
} from "@prisma/client";

export type InvoiceWithCustomer = Invoice & {
  customer: Customer;
  createdBy: User;
  approvedBy?: User | null;
  Payment: Payment[];
  InvoiceItem: (InvoiceItem & {
    product: Product;
  })[];
};
