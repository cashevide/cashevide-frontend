import { View, ViewProps, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/src/shared/utils/cn";

type ContainerVariant = "narrow" | "desktop" | "full";

const VARIANT_CLASS: Record<ContainerVariant, string> = {
  narrow: "max-w-narrow",
  desktop: "max-w-desktop",
  full: "w-full",
};

interface ContainerProps extends ViewProps {
  variant?: ContainerVariant;
  className?: string;
  safeArea?: boolean;
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

  const content = (
    <View
      className={cn("flex-1 w-full mx-auto", VARIANT_CLASS[variant], className)}
      style={[
        safeArea && {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
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
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    );
  }

  return <View className="flex-1 bg-background">{content}</View>;
}
