import type { InvoiceStatus, InvoiceTemplate } from "../types/invoiceTypes";
import ClassicInvoiceLayout from "./invoice-preview/ClassicInvoiceLayout";
import StandardInvoiceLayout from "./invoice-preview/StandardInvoiceLayout";

// A subset of the full Invoice shape, loose enough to also describe a
// draft that hasn't been saved yet (no id/invoice_number/status from
// the backend). The create screen builds one of these from live form
// state; the detail/edit screens can pass a real saved Invoice
// directly, since Invoice is a superset of this.
export type InvoicePreviewData = {
  invoice_number?: string;
  status?: InvoiceStatus;
  template?: InvoiceTemplate;
  currency: string;
  issue_date?: string | null;
  due_date?: string | null;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  items: {
    id: number | string;
    title: string;
    quantity: string;
    unit_price: string;
    total: string;
  }[];
  subtotal: string;
  discount: string;
  total_amount: string;
  amount_paid?: string;
  balance_due?: string;
};

type InvoicePreviewProps = {
  invoice: InvoicePreviewData;
};

// Pure router — picks the layout matching invoice.template and renders
// it. No JSX or styling of its own, so a new template only ever means
// adding one more case here plus a new file under invoice-preview/,
// never touching the two layouts that already exist.
//
// Defaults to "classic" when template is missing (e.g. an older draft
// preview built before this field existed) — matches the backend's own
// default.
export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const template = invoice.template ?? "classic";

  switch (template) {
    case "standard":
      return <StandardInvoiceLayout invoice={invoice} />;
    case "classic":
    default:
      return <ClassicInvoiceLayout invoice={invoice} />;
  }
}
