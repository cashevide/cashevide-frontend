import { View } from "react-native";

import { Text } from "@/src/shared/ui";
import {
  formatDashboardAmountParts,
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
  const parts = formatDashboardAmountParts(amount, currency);

  return (
    <View className="flex-1 web:flex-none web:w-full bg-success/15 border border-success/30 rounded-lg p-4 web:p-5 gap-1">
      <Text variant="overline" className="text-success-text">
        Total Received
      </Text>

      {isEmpty ? (
        <Text variant="heading" className="text-success-text web:text-2xl">
          —
        </Text>
      ) : parts.isSymbol ? (
        <Text variant="heading" className="text-success-text web:text-2xl">
          {parts.currency}
          {parts.value}
        </Text>
      ) : (
        <View className="flex-row items-baseline gap-1.5">
          <Text variant="body-sm" className="text-success-text">
            {parts.currency}
          </Text>
          <Text variant="heading" className="text-success-text web:text-2xl">
            {parts.value}
          </Text>
        </View>
      )}
    </View>
  );
}
