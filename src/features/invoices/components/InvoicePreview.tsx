import { Image, View } from "react-native";

import { useBusinessProfile } from "@/src/features/business-profile/hooks/useBusinessProfile";
import { Text } from "@/src/shared/ui";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

import type { InvoiceStatus } from "../types/invoiceTypes";

// A subset of the full Invoice shape, loose enough to also describe a
// draft that hasn't been saved yet (no id/invoice_number/status from
// the backend). The create screen builds one of these from live form
// state; the detail/edit screens can pass a real saved Invoice
// directly, since Invoice is a superset of this.
export type InvoicePreviewData = {
  invoice_number?: string;
  status?: InvoiceStatus;
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

function formatMoney(amount: string, currency: string): string {
  return `${currency || ""} ${amount}`.trim();
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const businessProfile = useBusinessProfile();

  const hasLogo = !!businessProfile.data?.logo;
  const hasBusinessAddress = !!businessProfile.data?.address;
  const hasBusinessPhone = !!businessProfile.data?.phone_number;
  const hasEmail = !!invoice.email;
  const hasPhone = !!invoice.phone;
  const hasAddress = !!invoice.address;
  const hasAmountPaid = invoice.amount_paid != null;
  const hasBalanceDue = invoice.balance_due != null;

  return (
    <View className="gap-1 rounded-lg bg-card p-4 shadow">
      <View className="flex-row items-start justify-between">
        <View className="flex-shrink flex-row gap-2.5">
          {hasLogo && (
            <Image
              source={{ uri: businessProfile.data?.logo ?? undefined }}
              className="h-10 w-10"
              resizeMode="contain"
            />
          )}
          <View>
            <Text variant="body" className="font-semibold">
              {businessProfile.data?.business_name || "Your Business"}
            </Text>
            {hasBusinessAddress && (
              <Text variant="caption">{businessProfile.data?.address}</Text>
            )}
            {hasBusinessPhone && (
              <Text variant="caption">
                {businessProfile.data?.phone_number}
              </Text>
            )}
          </View>
        </View>

        {invoice.status && <InvoiceStatusBadge status={invoice.status} />}
      </View>

      <View className="my-3 h-px bg-border" />

      <View className="flex-row justify-between">
        <View>
          <Text variant="caption">Invoice Number</Text>
          <Text variant="body-sm" className="font-semibold">
            {invoice.invoice_number ?? "—"}
          </Text>
        </View>
        <View>
          <Text variant="caption">Issue Date</Text>
          <Text variant="body-sm" className="font-semibold">
            {invoice.issue_date ?? "—"}
          </Text>
        </View>
        <View>
          <Text variant="caption">Due Date</Text>
          <Text variant="body-sm" className="font-semibold">
            {invoice.due_date ?? "—"}
          </Text>
        </View>
      </View>

      <View className="my-3 h-px bg-border" />

      <Text variant="caption" className="mb-1.5 font-semibold">
        Bill To
      </Text>
      <Text variant="body-sm" className="font-semibold">
        {invoice.name || "Untitled Client"}
      </Text>
      {hasEmail && <Text variant="caption">{invoice.email}</Text>}
      {hasPhone && <Text variant="caption">{invoice.phone}</Text>}
      {hasAddress && <Text variant="caption">{invoice.address}</Text>}

      <View className="my-3 h-px bg-border" />

      <Text variant="caption" className="mb-1.5 font-semibold">
        Items
      </Text>
      <View className="flex-row border-b border-border pb-1.5">
        <Text variant="caption" className="flex-[2] font-semibold">
          Description
        </Text>
        <Text variant="caption" className="flex-1 text-right font-semibold">
          Qty
        </Text>
        <Text variant="caption" className="flex-1 text-right font-semibold">
          Price
        </Text>
        <Text variant="caption" className="flex-1 text-right font-semibold">
          Total
        </Text>
      </View>

      {invoice.items.map((item) => (
        <View
          key={item.id}
          className="flex-row border-b border-border/50 py-1.5"
        >
          <Text variant="body-sm" className="flex-[2]">
            {item.title || "—"}
          </Text>
          <Text variant="body-sm" className="flex-1 text-right">
            {item.quantity || "—"}
          </Text>
          <Text variant="body-sm" className="flex-1 text-right">
            {item.unit_price || "—"}
          </Text>
          <Text variant="body-sm" className="flex-1 text-right">
            {item.total || "—"}
          </Text>
        </View>
      ))}

      <View className="my-3 h-px bg-border" />

      <View className="gap-1">
        <View className="flex-row justify-between">
          <Text variant="body-sm" className="text-muted-foreground">
            Subtotal
          </Text>
          <Text variant="body-sm">
            {formatMoney(invoice.subtotal, invoice.currency)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text variant="body-sm" className="text-muted-foreground">
            Discount
          </Text>
          <Text variant="body-sm">
            {formatMoney(invoice.discount, invoice.currency)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text variant="body-sm" className="font-semibold">
            Total
          </Text>
          <Text variant="body-sm" className="font-semibold">
            {formatMoney(invoice.total_amount, invoice.currency)}
          </Text>
        </View>

        {hasAmountPaid && (
          <View className="flex-row justify-between">
            <Text variant="body-sm" className="text-muted-foreground">
              Amount Paid
            </Text>
            <Text variant="body-sm">
              {formatMoney(invoice.amount_paid!, invoice.currency)}
            </Text>
          </View>
        )}
        {hasBalanceDue && (
          <View className="flex-row justify-between">
            <Text variant="body-sm" className="font-semibold">
              Balance Due
            </Text>
            <Text variant="body-sm" className="font-semibold">
              {formatMoney(invoice.balance_due!, invoice.currency)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
