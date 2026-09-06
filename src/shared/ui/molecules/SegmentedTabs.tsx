import { Pressable, View } from "react-native";

import { cn } from "@/src/shared/utils/cn";
import { Text } from "../atoms/Text";

export type SegmentedTabItem = {
  key: string;
  label: string;
  // Optional sentiment tint for the active state — used when segments
  // represent a judgment (e.g. a POSITIVE/NEGATIVE review tag) rather
  // than a neutral choice (currency, sort order). Omit for the default
  // neutral bg-card active state.
  variant?: "success" | "destructive";
};

interface SegmentedTabsProps {
  items: SegmentedTabItem[];
  // Nullable — a group can start with nothing selected (e.g. an
  // optional mutually-exclusive tag group), unlike a currency/sort
  // control where something is always active. Whether tapping an
  // already-active segment deselects it back to null is the caller's
  // decision (in onSelect), not this component's — it only renders
  // whatever activeKey it's given.
  activeKey: string | null;
  onSelect: (key: string) => void;
  className?: string;
  // Centers the track when it's shorter than the available width
  // (e.g. a 2-item tag group, or Profile's two tabs). Left unset
  // (false) for every other existing usage so nothing else changes —
  // a longer list that actually needs to scroll ignores this anyway.
  centered?: boolean;
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
  centered = false,
}: SegmentedTabsProps) {
  const track = (
    <View
      className={cn(
        centered ? "self-center" : "self-start",
        "flex-row p-1 rounded-md bg-secondary/50 border border-border/50",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        const activeBgClass =
          item.variant === "success"
            ? "bg-success/15"
            : item.variant === "destructive"
              ? "bg-destructive/15"
              : "bg-card shadow-sm";
        const activeTextClass =
          item.variant === "success"
            ? "text-success-text"
            : item.variant === "destructive"
              ? "text-destructive-text"
              : "text-foreground";

        return (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={cn(
              "h-7 px-3.5 rounded-sm items-center justify-center",
              isActive && activeBgClass,
            )}
          >
            <Text
              variant="body-sm"
              className={cn(
                "font-medium",
                isActive ? activeTextClass : "text-muted-foreground",
              )}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  // "self-center" alone doesn't center anything without a full-width
  // parent to center within — RN's flex layout centers a child
  // relative to its parent's cross axis, so without this wrapper the
  // track has nothing wider than itself to center against.
  if (centered) {
    return <View className="w-full items-center">{track}</View>;
  }

  return track;
}
