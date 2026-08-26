import { Pressable, View } from "react-native";

import { cn } from "@/src/shared/utils/cn";
import { Text } from "@/src/shared/ui";

type DashboardCurrencyTabsProps = {
  currencies: string[];
  selectedCurrency: string | null;
  onSelect: (currency: string) => void;
};

// Deliberately not PillTabs here — SubTabs above this (Dashboard /
// Invoices / Clients / Products) already uses that floating-pill look
// for page-level navigation. Reusing it for a same-page currency filter
// made the two rows read as the same kind of control. This is a single
// bordered track with tight segments instead, closer to an iOS
// segmented control — visually secondary and clearly a filter/toggle,
// not another navigation row.
export default function DashboardCurrencyTabs({
  currencies,
  selectedCurrency,
  onSelect,
}: DashboardCurrencyTabsProps) {
  if (currencies.length === 0) {
    return null;
  }

  const activeCurrency = selectedCurrency ?? currencies[0];

  return (
    <View className="self-start flex-row p-1 rounded-md bg-secondary/50 border border-border/50">
      {currencies.map((currency) => {
        const isActive = currency === activeCurrency;

        return (
          <Pressable
            key={currency}
            onPress={() => onSelect(currency)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={cn(
              "h-7 px-3.5 rounded-sm items-center justify-center",
              isActive && "bg-card shadow-sm",
            )}
          >
            <Text
              variant="body-sm"
              className={cn(
                "font-medium",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {currency}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
