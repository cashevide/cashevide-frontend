import { View } from "react-native";

import { Text } from "@/src/shared/ui";
import { invoicePreviewColors as colors } from "./invoicePreviewColors";

import type { InvoiceStatus } from "../../types/invoiceTypes";

type StatusConfigEntry = {
  label: string;
  bg: string;
  text: string;
};

// Light-mode-only mirror of InvoiceStatusBadge.tsx / Badge.tsx's variant
// mapping — see invoicePreviewColors.ts for why this can't just reuse the
// shared `Badge` atom (it's theme-aware; this must never be).
const STATUS_CONFIG: Record<InvoiceStatus, StatusConfigEntry> = {
  DRAFT: {
    label: "Draft",
    bg: colors.statusDefaultBg,
    text: colors.statusDefaultText,
  },
  UNPAID: {
    label: "Unpaid",
    bg: colors.statusWarningBg,
    text: colors.statusWarningText,
  },
  PARTIALLY_PAID: {
    label: "Partially Paid",
    bg: colors.statusInfoBg,
    text: colors.statusInfoText,
  },
  PAID: {
    label: "Paid",
    bg: colors.statusSuccessBg,
    text: colors.statusSuccessText,
  },
};

type InvoicePreviewStatusBadgeProps = {
  status: InvoiceStatus;
};

export default function InvoicePreviewStatusBadge({
  status,
}: InvoicePreviewStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View
      className="self-start rounded-full px-2.5 py-1"
      style={{ backgroundColor: config.bg }}
    >
      <Text
        variant="caption"
        className="font-semibold"
        style={{ color: config.text }}
      >
        {config.label}
      </Text>
    </View>
  );
}
