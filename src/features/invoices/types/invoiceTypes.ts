import type {
  InvoiceItem,
  InvoiceItemRequest,
  InvoiceItemsError,
} from "./invoiceItemTypes";
import type {
  PaymentRecord,
  PaymentRecordRequest,
  PaymentRecordsError,
} from "./paymentTypes";

// Generic DRF field-error shape — same pattern as other typed files.
type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

export type InvoiceStatus = "DRAFT" | "UNPAID" | "PARTIALLY_PAID" | "PAID";

// -------------------- shared shape --------------------
// This is the full InvoiceSerialzer shape — used for create response,
// detail response, and update (PUT) response. All financial fields
// (subtotal/total_amount/amount_paid/balance_due/status/invoice_number)
// are backend-computed and read-only — never editable in any form.
export type Invoice = {
  id: number;
  user: number;
  client: number | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  invoice_number: string;
  items: InvoiceItem[];
  status: InvoiceStatus;
  currency: string;
  issue_date: string | null;
  due_date: string | null;
  subtotal: string;
  discount: string;
  total_amount: string;
  amount_paid: string;
  balance_due: string;
  payments: PaymentRecord[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

// -------------------- list --------------------
// GET /invoices/
export type InvoicesListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Invoice[];
};

// -------------------- create --------------------
// POST /invoices/
//
// Rules (from backend clean()):
// - Provide EITHER `client` (existing client id) OR `name` (manual entry).
//   Sending neither raises a validation error. If `client` is provided,
//   any of name/email/phone/address left blank gets auto-filled from the
//   client record on the backend — do not assume the value you sent is the
//   value that comes back, always re-render from the response.
// - `items` is required — send at least an empty array if there truly are
//   none, but in practice an invoice needs items to have any value.
// - `payments` is required too — send `[]` on create, since you can't
//   record a payment before the invoice exists.
// - Do NOT send status/invoice_number/subtotal/total_amount/amount_paid/
//   balance_due — they are read-only and will be ignored/rejected.
export type CreateInvoiceRequest = {
  client?: number | null;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  currency?: string;
  issue_date?: string | null;
  due_date?: string | null;
  discount?: string;
  items: InvoiceItemRequest[];
  payments: PaymentRecordRequest[];
};

export type CreateInvoiceResponse = Invoice;

// -------------------- detail --------------------
// GET /invoices/{id}/
export type InvoiceDetailResponse = Invoice;

export type InvoiceNotFoundError = {
  detail: string;
};

// -------------------- update --------------------
// PUT /invoices/{id}/ — PATCH is NOT supported by this backend for
// invoices (items/payments become required-field errors without a full
// payload) — always use PUT, always send the FULL items and payments
// arrays (existing entries included, with their `id`, to keep them).
export type UpdateInvoiceRequest = CreateInvoiceRequest;

export type UpdateInvoiceResponse = Invoice;

// -------------------- validation errors --------------------
export type InvoiceFieldErrorField =
  | "client"
  | "name"
  | "email"
  | "phone"
  | "address"
  | "currency"
  | "issue_date"
  | "due_date"
  | "discount";

export type InvoiceFieldError = FieldErrors<InvoiceFieldErrorField>;

// items/payments errors are nested arrays, not string arrays — see
// invoiceItemTypes.ts / paymentTypes.ts for their shapes.
export type InvoiceNestedFieldError = {
  items?: InvoiceItemsError | string[];
  payments?: PaymentRecordsError | string[];
};

// The credit-points-exhausted error comes back as a bare top-level array
// of strings, NOT the usual {field: [...]}$ shape — e.g.
// ["You do not have enough credit points to create a new invoice."]
// Check `Array.isArray(errorData)` before treating it as a field-error map.
export type InvoiceNonFieldError = string[];

export type CreateInvoiceError =
  | InvoiceFieldError
  | InvoiceNestedFieldError
  | InvoiceNonFieldError;

export type UpdateInvoiceError = CreateInvoiceError;

// -------------------- delete --------------------
// DELETE /invoices/{id}/ — soft delete (is_active=False), 204 No Content.
