import { StyleSheet, Text, View } from "react-native";

import { formatDashboardAmount } from "../utils/invoiceDashboardUtils";

import type { CurrencyAmountMap } from "../types/invoiceDashboardTypes";

type DashboardSummaryCardProps = {
  thisMonth: CurrencyAmountMap;
  lastMonth: CurrencyAmountMap;
  lastThreeMonths: CurrencyAmountMap;
  thisYear: CurrencyAmountMap;
  lastYear: CurrencyAmountMap;
  currency: string;
};

function SummaryRow({
  label,
  bucket,
  currency,
}: {
  label: string;
  bucket: CurrencyAmountMap;
  currency: string;
}) {
  const amount = bucket[currency];

  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>
        {amount != null ? formatDashboardAmount(amount, currency) : "—"}
      </Text>
    </View>
  );
}

export default function DashboardSummaryCard({
  thisMonth,
  lastMonth,
  lastThreeMonths,
  thisYear,
  lastYear,
  currency,
}: DashboardSummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Revenue Breakdown</Text>

      <SummaryRow label="This Month" bucket={thisMonth} currency={currency} />
      <SummaryRow label="Last Month" bucket={lastMonth} currency={currency} />
      <SummaryRow
        label="Last 3 Months"
        bucket={lastThreeMonths}
        currency={currency}
      />
      <SummaryRow label="This Year" bucket={thisYear} currency={currency} />
      <SummaryRow label="Last Year" bucket={lastYear} currency={currency} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 16,
    gap: 8,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  rowLabel: {
    color: "#666",
  },
  rowValue: {
    fontWeight: "bold",
  },
});
