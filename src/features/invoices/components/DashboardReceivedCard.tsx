import { StyleSheet, Text, View } from "react-native";

import {
  formatDashboardAmount,
  isBucketEmpty,
} from "../utils/invoiceDashboardUtils";

import type { CurrencyAmountMap } from "../types/invoiceDashboardTypes";

type DashboardReceivedCardProps = {
  totalRevenue: CurrencyAmountMap;
  currency: string;
};

export default function DashboardReceivedCard({
  totalRevenue,
  currency,
}: DashboardReceivedCardProps) {
  const isEmpty = isBucketEmpty(totalRevenue);
  const amount = totalRevenue[currency] ?? 0;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Total Received</Text>
      <Text style={styles.amount}>
        {isEmpty ? "—" : formatDashboardAmount(amount, currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
    padding: 16,
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: "#2e7d32",
    fontWeight: "bold",
  },
  amount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b5e20",
  },
});
