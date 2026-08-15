import { View } from "react-native";

import { Text } from "@/src/shared/ui";
import { cn } from "@/src/shared/utils/cn";
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
  isLast,
}: {
  label: string;
  bucket: CurrencyAmountMap;
  currency: string;
  isLast: boolean;
}) {
  const amount = bucket[currency];

  return (
    <View
      className={cn(
        "flex-row items-center justify-between py-2.5",
        !isLast && "border-b border-border/50",
      )}
    >
      <Text variant="body-sm" className="text-muted-foreground">
        {label}
      </Text>
      <Text variant="body-sm" className="font-semibold text-right">
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
  const rows = [
    { label: "This Month", bucket: thisMonth },
    { label: "Last Month", bucket: lastMonth },
    { label: "Last 3 Months", bucket: lastThreeMonths },
    { label: "This Year", bucket: thisYear },
    { label: "Last Year", bucket: lastYear },
  ];

  return (
    <View className="bg-card border border-border rounded-lg p-4 gap-1">
      <Text variant="body-sm" className="font-semibold mb-1">
        Revenue Breakdown
      </Text>

      {rows.map((row, index) => (
        <SummaryRow
          key={row.label}
          label={row.label}
          bucket={row.bucket}
          currency={currency}
          isLast={index === rows.length - 1}
        />
      ))}
    </View>
  );
}
