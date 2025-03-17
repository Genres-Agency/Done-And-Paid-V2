import { InvoiceWithCustomer } from "@/src/types/invoice";

interface InvoiceItemsProps {
  invoice: InvoiceWithCustomer;
}

export function InvoiceItems({ invoice }: InvoiceItemsProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-muted">
            <th className="text-left py-3 px-4 font-semibold text-foreground">
              Item
            </th>
            <th className="text-right py-3 px-4 font-semibold text-foreground">
              Quantity
            </th>
            <th className="text-right py-3 px-4 font-semibold text-foreground">
              Unit Price
            </th>
            <th className="text-right py-3 px-4 font-semibold text-foreground">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.InvoiceItem.map((item, index) => (
            <tr key={index} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4 text-foreground">{item.product.name}</td>
              <td className="text-right py-3 px-4 text-muted-foreground">
                {item.quantity}
              </td>
              <td className="text-right py-3 px-4 text-muted-foreground">
                {item.unitPrice.toFixed(2)}
              </td>
              <td className="text-right py-3 px-4 text-foreground font-medium">
                {(item.quantity * item.unitPrice).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
