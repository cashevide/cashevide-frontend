import { Pressable, View } from "react-native";

import { cn } from "@/src/shared/utils/cn";
import { Text } from "../atoms/Text";

export type SegmentedTabItem = {
  key: string;
  label: string;
};

interface SegmentedTabsProps {
  items: SegmentedTabItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  className?: string;
}

// Same item/activeKey/onSelect shape as PillTabs, deliberately — this is
// the same kind of control (a small set of mutually-exclusive options)
// but for a same-page filter/toggle rather than page-level navigation.
// PillTabs' floating pills read as navigation (SubTabs uses that exact
// look for Dashboard/Invoices/Clients/Products); a same-page control —
// a currency switch, a sort order — needs to look visually secondary
// and clearly grouped, not like another row of pages to visit. This is
// a single bordered track with tight segments instead, closer to an
// iOS segmented control.
export function SegmentedTabs({
  items,
  activeKey,
  onSelect,
  className = "",
}: SegmentedTabsProps) {
  return (
    <View
      className={cn(
        "self-start flex-row p-1 rounded-md bg-secondary/50 border border-border/50",
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
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
