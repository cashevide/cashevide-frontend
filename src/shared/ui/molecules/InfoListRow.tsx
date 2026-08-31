import { ComponentType } from "react";
import { Pressable, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import { ClipboardDocumentIcon } from "react-native-heroicons/outline";

import { cn } from "@/src/shared/utils/cn";
import { Text } from "../atoms/Text";

type IconComponent = ComponentType<SvgProps>;

interface InfoListRowProps {
  icon: IconComponent;
  label: string;
  value?: string;
  // Group is responsible for telling the last row not to draw a
  // divider — this component only knows about itself, not its
  // siblings.
  isLast?: boolean;
  // Only for values meant to be shared/reused (a referral code, an
  // account ID) rather than just read — renders a trailing copy
  // button. Most rows (email, phone, address) are display-only and
  // leave this unset.
  onCopy?: () => void;
}

// A single labeled field in a settings-style detail list: icon on the
// left, label/value stacked in a row rather than InfoRow's old
// caption-above-body stack. This is the standard "settings row" pattern
// (Stripe, FreshBooks, Wave) — scannable at a glance across many
// fields, with the icon giving each row a recognizable shape before
// reading the text. Fields with no value are hidden entirely rather
// than shown empty, same as the old InfoRow.
export function InfoListRow({
  icon: Icon,
  label,
  value,
  isLast = false,
  onCopy,
}: InfoListRowProps) {
  if (!value) {
    return null;
  }

  return (
    <View
      className={cn(
        "flex-row items-center gap-3 py-3",
        !isLast && "border-b border-border/50",
      )}
    >
      <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary">
        <Icon
          width={18}
          height={18}
          color="rgb(var(--color-muted-foreground))"
        />
      </View>

      <Text variant="body-sm" className="text-muted-foreground w-28">
        {label}
      </Text>

      <Text variant="body" className="flex-1 font-medium" numberOfLines={1}>
        {value}
      </Text>

      {onCopy && (
        <Pressable
          onPress={onCopy}
          accessibilityRole="button"
          accessibilityLabel={`Copy ${label}`}
          className="h-8 w-8 items-center justify-center rounded-md"
        >
          <ClipboardDocumentIcon
            width={18}
            height={18}
            color="rgb(var(--color-muted-foreground))"
          />
        </Pressable>
      )}
    </View>
  );
}
