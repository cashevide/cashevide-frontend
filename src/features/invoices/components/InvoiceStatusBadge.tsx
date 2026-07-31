import { StyleSheet, Text, View } from "react-native";

import type { InvoiceStatus } from "../types/invoiceTypes";

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; backgroundColor: string; textColor: string }
> = {
  DRAFT: { label: "Draft", backgroundColor: "#e0e0e0", textColor: "#555" },
  UNPAID: { label: "Unpaid", backgroundColor: "#ffe0b2", textColor: "#e65100" },
  PARTIALLY_PAID: {
    label: "Partially Paid",
    backgroundColor: "#bbdefb",
    textColor: "#0d47a1",
  },
  PAID: { label: "Paid", backgroundColor: "#c8e6c9", textColor: "#1b5e20" },
};

type InvoiceStatusBadgeProps = {
  status: InvoiceStatus;
};

export default function InvoiceStatusBadge({
  status,
}: InvoiceStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <Text style={[styles.text, { color: config.textColor }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
