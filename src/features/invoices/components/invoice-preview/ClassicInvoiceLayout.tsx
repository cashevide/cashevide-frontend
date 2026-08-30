import { Image, View } from "react-native";

import { useBusinessProfile } from "@/src/features/business-profile/hooks/useBusinessProfile";
import { Text } from "@/src/shared/ui";
import InvoicePreviewStatusBadge from "./InvoicePreviewStatusBadge";
import { invoicePreviewColors as colors } from "./invoicePreviewColors";

import type { InvoicePreviewData } from "../InvoicePreview";

type ClassicInvoiceLayoutProps = {
  invoice: InvoicePreviewData;
};

function formatMoney(amount: string, currency: string): string {
  return `${currency || ""} ${amount}`.trim();
}

// Always light — see invoicePreviewColors.ts. Every color here comes
// from the `colors` constant via `style`, never a NativeWind className,
// so this layout looks identical whether the app is in dark or light
// mode.
export default function ClassicInvoiceLayout({
  invoice,
}: ClassicInvoiceLayoutProps) {
  const liveBusinessProfile = useBusinessProfile();

  // A saved invoice (has an id) carries a frozen business_snapshot
  // from creation time — that snapshot is the ONLY source used for it,
  // even if it's somehow empty, so this preview always matches what
  // download_pdf on the backend would actually render. Only an
  // unsaved draft (no id yet) falls back to the live profile, since
  // that's genuinely the data the backend will snapshot on first save.
  const isSavedInvoice = invoice.id != null;
  const snapshot = invoice.business_snapshot;

  const businessName = isSavedInvoice
    ? snapshot?.business_name
    : liveBusinessProfile.data?.business_name;
  const businessLogo = isSavedInvoice
    ? snapshot?.logo
    : liveBusinessProfile.data?.logo;
  const businessAddress = isSavedInvoice
    ? snapshot?.address
    : liveBusinessProfile.data?.address;
  const businessPhone = isSavedInvoice
    ? snapshot?.phone_number
    : liveBusinessProfile.data?.phone_number;

  const hasLogo = !!businessLogo;
  const hasBusinessAddress = !!businessAddress;
  const hasBusinessPhone = !!businessPhone;
  const hasEmail = !!invoice.email;
  const hasPhone = !!invoice.phone;
  const hasAddress = !!invoice.address;
  const hasAmountPaid = invoice.amount_paid != null;
  const hasBalanceDue = invoice.balance_due != null;

  return (
    <View
      className="gap-1 rounded-lg p-4 shadow"
      style={{ backgroundColor: colors.card }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-shrink flex-row gap-2.5">
          {hasLogo && (
            <Image
              source={{ uri: businessLogo ?? undefined }}
              className="h-10 w-10"
              resizeMode="contain"
            />
          )}
          <View>
            <Text
              variant="body"
              className="font-semibold"
              style={{ color: colors.cardForeground }}
            >
              {businessName || "Your Business"}
            </Text>
            {hasBusinessAddress && (
              <Text variant="caption" style={{ color: colors.mutedForeground }}>
                {businessAddress}
              </Text>
            )}
            {hasBusinessPhone && (
              <Text variant="caption" style={{ color: colors.mutedForeground }}>
                {businessPhone}
              </Text>
            )}
          </View>
        </View>

        {invoice.status && (
          <InvoicePreviewStatusBadge status={invoice.status} />
        )}
      </View>

      <View className="my-3 h-px" style={{ backgroundColor: colors.border }} />

      <View className="flex-row justify-between">
        <View>
          <Text variant="caption" style={{ color: colors.mutedForeground }}>
            Invoice Number
          </Text>
          <Text
            variant="body-sm"
            className="font-semibold"
            style={{ color: colors.cardForeground }}
          >
            {invoice.invoice_number ?? "—"}
          </Text>
        </View>
        <View>
          <Text variant="caption" style={{ color: colors.mutedForeground }}>
            Issue Date
          </Text>
          <Text
            variant="body-sm"
            className="font-semibold"
            style={{ color: colors.cardForeground }}
          >
            {invoice.issue_date ?? "—"}
          </Text>
        </View>
        <View>
          <Text variant="caption" style={{ color: colors.mutedForeground }}>
            Due Date
          </Text>
          <Text
            variant="body-sm"
            className="font-semibold"
            style={{ color: colors.cardForeground }}
          >
            {invoice.due_date ?? "—"}
          </Text>
        </View>
      </View>

      <View className="my-3 h-px" style={{ backgroundColor: colors.border }} />

      <Text
        variant="caption"
        className="mb-1.5 font-semibold"
        style={{ color: colors.mutedForeground }}
      >
        Bill To
      </Text>
      <Text
        variant="body-sm"
        className="font-semibold"
        style={{ color: colors.cardForeground }}
      >
        {invoice.name || "Untitled Client"}
      </Text>
      {hasEmail && (
        <Text variant="caption" style={{ color: colors.mutedForeground }}>
          {invoice.email}
        </Text>
      )}
      {hasPhone && (
        <Text variant="caption" style={{ color: colors.mutedForeground }}>
          {invoice.phone}
        </Text>
      )}
      {hasAddress && (
        <Text variant="caption" style={{ color: colors.mutedForeground }}>
          {invoice.address}
        </Text>
      )}

      <View className="my-3 h-px" style={{ backgroundColor: colors.border }} />

      <Text
        variant="caption"
        className="mb-1.5 font-semibold"
        style={{ color: colors.mutedForeground }}
      >
        Items
      </Text>
      <View
        className="flex-row border-b pb-1.5"
        style={{ borderColor: colors.border }}
      >
        <Text
          variant="caption"
          className="flex-[2] font-semibold"
          style={{ color: colors.mutedForeground }}
        >
          Description
        </Text>
        <Text
          variant="caption"
          className="flex-1 text-right font-semibold"
          style={{ color: colors.mutedForeground }}
        >
          Qty
        </Text>
        <Text
          variant="caption"
          className="flex-1 text-right font-semibold"
          style={{ color: colors.mutedForeground }}
        >
          Price
        </Text>
        <Text
          variant="caption"
          className="flex-1 text-right font-semibold"
          style={{ color: colors.mutedForeground }}
        >
          Total
        </Text>
      </View>

      {invoice.items.map((item) => (
        <View
          key={item.id}
          className="flex-row border-b py-1.5"
          style={{ borderColor: `${colors.border}80` }}
        >
          <Text
            variant="body-sm"
            className="flex-[2]"
            style={{ color: colors.cardForeground }}
          >
            {item.title || "—"}
          </Text>
          <Text
            variant="body-sm"
            className="flex-1 text-right"
            style={{ color: colors.cardForeground }}
          >
            {item.quantity || "—"}
          </Text>
          <Text
            variant="body-sm"
            className="flex-1 text-right"
            style={{ color: colors.cardForeground }}
          >
            {item.unit_price || "—"}
          </Text>
          <Text
            variant="body-sm"
            className="flex-1 text-right"
            style={{ color: colors.cardForeground }}
          >
            {item.total || "—"}
          </Text>
        </View>
      ))}

      <View className="my-3 h-px" style={{ backgroundColor: colors.border }} />

      <View className="gap-1">
        <View className="flex-row justify-between">
          <Text variant="body-sm" style={{ color: colors.mutedForeground }}>
            Subtotal
          </Text>
          <Text variant="body-sm" style={{ color: colors.cardForeground }}>
            {formatMoney(invoice.subtotal, invoice.currency)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text variant="body-sm" style={{ color: colors.mutedForeground }}>
            Discount
          </Text>
          <Text variant="body-sm" style={{ color: colors.cardForeground }}>
            {formatMoney(invoice.discount, invoice.currency)}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text
            variant="body-sm"
            className="font-semibold"
            style={{ color: colors.cardForeground }}
          >
            Total
          </Text>
          <Text
            variant="body-sm"
            className="font-semibold"
            style={{ color: colors.cardForeground }}
          >
            {formatMoney(invoice.total_amount, invoice.currency)}
          </Text>
        </View>

        {hasAmountPaid && (
          <View className="flex-row justify-between">
            <Text variant="body-sm" style={{ color: colors.mutedForeground }}>
              Amount Paid
            </Text>
            <Text variant="body-sm" style={{ color: colors.cardForeground }}>
              {formatMoney(invoice.amount_paid!, invoice.currency)}
            </Text>
          </View>
        )}
        {hasBalanceDue && (
          <View className="flex-row justify-between">
            <Text
              variant="body-sm"
              className="font-semibold"
              style={{ color: colors.cardForeground }}
            >
              Balance Due
            </Text>
            <Text
              variant="body-sm"
              className="font-semibold"
              style={{ color: colors.cardForeground }}
            >
              {formatMoney(invoice.balance_due!, invoice.currency)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
