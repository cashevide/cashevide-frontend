import { View } from "react-native";

import { cn } from "@/src/shared/utils/cn";
import { Text } from "./Text";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
}

export function Divider({
  orientation = "horizontal",
  label,
  className = "",
}: DividerProps) {
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

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      className={cn("h-px w-full bg-border", className)}
    />
  );
}
