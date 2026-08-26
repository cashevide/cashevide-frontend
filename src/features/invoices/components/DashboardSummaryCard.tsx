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

// On native this renders as one row in a plain list (label left, amount
// right, hairline divider below). On web it becomes a standalone cell in
// a 2-column grid instead — same label/amount pairing, but stacked
// vertically like a mini stat card, since a wide card with only two
// text columns would otherwise leave the row looking sparse.
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
  const formattedAmount =
    amount != null ? formatDashboardAmount(amount, currency) : "—";

  return (
    <View
      className={cn(
        "flex-row items-center justify-between py-2.5",
        "web:w-[calc(50%-8px)] web:flex-col web:items-start web:justify-center",
        "web:bg-background/40 web:border web:border-border/50 web:rounded-md",
        "web:px-4 web:py-3 web:gap-1",
        !isLast && "border-b border-border/50 web:border-b-0",
      )}
    >
      <Text
        variant="body-sm"
        className="text-muted-foreground web:text-xs web:uppercase web:tracking-widest web:font-bold"
      >
        {label}
      </Text>
      <Text
        variant="body-sm"
        className="font-semibold text-right web:text-lg web:text-left"
      >
        {formattedAmount}
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
    <View className="flex-1 bg-card border border-border rounded-lg p-4 web:p-5 gap-1 web:gap-2">
      <Text variant="body-sm" className="font-semibold mb-1">
        Revenue Breakdown
      </Text>

      <View className="web:flex-row web:flex-wrap web:gap-2">
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
    </View>
  );
}
