import { View } from "react-native";
import { useColorScheme } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";

import { cn } from "@/src/shared/utils/cn";
import { Text } from "./Text";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
  // Fades from the border color to transparent left-to-right, instead
  // of ending in a hard edge. Only supported on the plain horizontal
  // divider (no label, no vertical orientation) — those already have
  // their own distinct rendering this doesn't try to merge with.
  fade?: boolean;
}

// expo-linear-gradient's `colors` prop is a native value, not CSS — it
// can't resolve the app's `var(--color-border)` custom property the
// way a className can, so the light/dark RGB values are duplicated
// here from global.css. If those tokens change, this needs updating
// too.
const BORDER_RGB = {
  light: "225, 225, 221",
  dark: "35, 35, 35",
} as const;

export function Divider({
  orientation = "horizontal",
  label,
  className = "",
  fade = false,
}: DividerProps) {
  const { colorScheme } = useColorScheme();
  const borderRgb = BORDER_RGB[colorScheme ?? "light"];

  if (orientation === "vertical") {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no"
        className={cn("w-px self-stretch bg-border", className)}
      />
    );
  }

  if (label) {
    return (
      <View className={cn("flex-row items-center gap-3", className)}>
        <View className="h-px flex-1 bg-border" />
        <Text variant="caption">{label}</Text>
        <View className="h-px flex-1 bg-border" />
      </View>
    );
  }

  if (fade) {
    return (
      <LinearGradient
        colors={[`rgba(${borderRgb}, 1)`, `rgba(${borderRgb}, 0)`]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{ height: 1 }}
        className={cn("w-full", className)}
      />
    );
  }

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      className={cn("h-px w-full bg-border", className)}
    />
  );
}
