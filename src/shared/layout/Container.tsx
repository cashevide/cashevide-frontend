import { View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

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
  padded?: boolean;
}

export function Container({
  variant = "full",
  className = "",
  safeArea = false,
  padded = true,
  children,
  ...props
}: ContainerProps) {
  const content = (
    <View
      className={twMerge(
        "flex-1 w-full mx-auto bg-background",
        padded && "px-6",
        VARIANT_CLASS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );

  if (safeArea) {
    return (
      <SafeAreaView className="flex-1 bg-background">{content}</SafeAreaView>
    );
  }

  return content;
}
