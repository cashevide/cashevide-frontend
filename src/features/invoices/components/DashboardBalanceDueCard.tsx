import { StyleSheet, Text, View } from "react-native";

import {
  isBucketEmpty,
  formatDashboardAmount,
} from "../utils/invoiceDashboardUtils";

import type { CurrencyAmountMap } from "../types/invoiceDashboardTypes";

type DashboardBalanceDueCardProps = {
  totalBalanceDue: CurrencyAmountMap;
  currency: string;
};

export default function DashboardBalanceDueCard({
  totalBalanceDue,
  currency,
}: DashboardBalanceDueCardProps) {
  const isEmpty = isBucketEmpty(totalBalanceDue);
  const amount = totalBalanceDue[currency] ?? 0;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Balance Due</Text>
      <Text style={styles.amount}>
        {isEmpty ? "—" : formatDashboardAmount(amount, currency)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff3e0",
    borderRadius: 8,
    padding: 16,
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: "#e65100",
    fontWeight: "bold",
  },
  amount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#bf360c",
  },
});
