import { Quote, Customer, User, QuoteItem, Product } from "@prisma/client";

export type QuoteWithCustomer = Quote & {
  customer: Customer;
  createdBy: User;
  approvedBy?: User | null;
  items: (QuoteItem & {
    product: Product;
  })[];
};
