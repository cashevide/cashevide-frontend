import { View, ViewProps, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/src/shared/utils/cn";

type ContainerVariant = "narrow" | "desktop" | "full";
type SafeAreaOption = boolean | "top" | "bottom";

const VARIANT_CLASS: Record<ContainerVariant, string> = {
  narrow: "max-w-narrow",
  desktop: "max-w-desktop",
  full: "w-full",
};

interface ContainerProps extends ViewProps {
  variant?: ContainerVariant;
  className?: string;
  // true = top + bottom (original behavior, unchanged for every existing
  // caller). "top"/"bottom" apply only that side — needed for screens
  // that render their own ScreenHeader above the Container, which
  // already accounts for the top inset itself; without this, stacking
  // safeArea={true} on both would double the top padding.
  safeArea?: SafeAreaOption;
  scroll?: boolean;
}

export function Container({
  variant = "full",
  className = "",
  safeArea = false,
  scroll = false,
  children,
  style,
  ...props
}: ContainerProps) {
  const insets = useSafeAreaInsets();

  const applyTop = safeArea === true || safeArea === "top";
  const applyBottom = safeArea === true || safeArea === "bottom";

  const content = (
    <View
      className={cn("flex-1 w-full mx-auto", VARIANT_CLASS[variant], className)}
      style={[
        (applyTop || applyBottom) && {
          paddingTop: applyTop ? insets.top : undefined,
          paddingBottom: applyBottom ? insets.bottom : undefined,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );

  if (scroll) {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ flexGrow: 1 }}
        // Web renders this as a real browser scrollbar sitting flush
        // against the content edge — unlike native's floating overlay
        // indicator, it visually "eats into" the last few pixels of
        // whatever's on the right. showsVerticalScrollIndicator only
        // controls the native indicator, so a small web-only inset on
        // the content itself is the actual fix.
        contentContainerClassName="web:pr-2"
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    );
  }

  return <View className="flex-1 bg-background">{content}</View>;
}
