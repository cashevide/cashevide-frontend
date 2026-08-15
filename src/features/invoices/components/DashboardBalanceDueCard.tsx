import { View } from "react-native";

import { Text } from "@/src/shared/ui";
import {
  isBucketEmpty,
  formatDashboardAmountParts,
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
  const parts = formatDashboardAmountParts(amount, currency);

  return (
    <View className="flex-1 bg-destructive/15 border border-destructive/30 rounded-lg p-4 gap-1">
      <Text variant="overline" className="text-destructive-text">
        Balance Due
      </Text>

      {isEmpty ? (
        <Text variant="heading" className="text-destructive-text">
          —
        </Text>
      ) : parts.isSymbol ? (
        <Text variant="heading" className="text-destructive-text">
          {parts.currency}
          {parts.value}
        </Text>
      ) : (
        <View className="flex-row items-baseline gap-1.5">
          <Text variant="body-sm" className="text-destructive-text">
            {parts.currency}
          </Text>
          <Text variant="heading" className="text-destructive-text">
            {parts.value}
          </Text>
        </View>
      )}
    </View>
  );
}
