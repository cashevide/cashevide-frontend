import { ScrollView, View, Pressable } from "react-native";

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
  // Centers the pill row when it's shorter than the available width
  // (e.g. Profile's two tabs). Left unset (false) for every other
  // existing usage so nothing else changes — a longer list that
  // actually needs to scroll ignores this anyway, since content wider
  // than the viewport can't be centered.
  centered?: boolean;
  // Purely a rendering choice — this is still PillTabs, still meant
  // for page-level navigation (route changes), same as every other
  // usage. "segmented" only swaps the pixels to match SegmentedTabs'
  // bordered-track look for screens where floating pills read as
  // incomplete (e.g. Profile's two tabs); it does not make this a
  // same-page filter/toggle control the way an actual SegmentedTabs
  // is. Don't reach for this to avoid using SegmentedTabs on a filter
  // — use SegmentedTabs itself there.
  variant?: "pills" | "segmented";
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
  centered = false,
  variant = "pills",
}: PillTabsProps) {
  const isSegmented = variant === "segmented";

  const tabs = (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: "row", gap: isSegmented ? 0 : 8 }}
      style={{ flexGrow: 0, flexShrink: 0 }}
      className={cn(
        centered ? "self-center" : "w-full",
        isSegmented && "rounded-md bg-secondary/50 border border-border/50 p-1",
        className,
      )}
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
              "items-center justify-center",
              isSegmented ? "h-7 px-3.5 rounded-sm" : "h-9 px-4 rounded-full",
              isActive
                ? isSegmented
                  ? "bg-card shadow-sm"
                  : "bg-secondary border border-border"
                : "bg-transparent",
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

  // "self-center" on the ScrollView alone doesn't work without a
  // full-width parent to center within — RN's flex layout centers a
  // child relative to its parent's cross axis, so without this wrapper
  // the ScrollView has nothing wider than itself to center against.
  if (centered) {
    return <View className="w-full items-center">{tabs}</View>;
  }

  return tabs;
}
