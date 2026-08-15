import { ScrollView, Pressable } from "react-native";

import { cn } from "@/src/shared/utils/cn";
import { Text } from "../atoms/Text";

export type PillTabItem = {
  key: string;
  label: string;
};

interface PillTabsProps {
  items: PillTabItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  className?: string;
}

// Visual language matches Button's outline (active) and ghost (inactive)
// variants exactly — same bg/border/text classes — just at pill sizing
// instead of Button's own size scale. Two independent existing usages
// (DashboardCurrencyTabs, InvoiceFilterModal's status pills) duplicated
// this exact pattern with hand-written StyleSheet; this component
// replaces both plus InvoiceSubTabs' plain buttons.
export function PillTabs({
  items,
  activeKey,
  onSelect,
  className = "",
}: PillTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: "row", gap: 8 }}
      style={{ flexGrow: 0, flexShrink: 0 }}
      className={cn("w-full", className)}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;

        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={cn(
              "h-9 px-4 rounded-full items-center justify-center",
              isActive ? "bg-secondary border border-border" : "bg-transparent",
            )}
          >
            <Text
              variant="body-sm"
              className={cn(
                "font-medium",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
