import { PropsWithChildren } from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/src/shared/utils/cn";
import { Text } from "@/src/shared/ui";

type ContainerVariant = "narrow" | "desktop" | "full";

const VARIANT_CLASS: Record<ContainerVariant, string> = {
  narrow: "max-w-narrow",
  desktop: "max-w-desktop",
  full: "w-full",
};

type ScreenHeaderProps = PropsWithChildren<{
  // Simple case — most screens just need a title. For anything more
  // (Reviews' logo + credit-points button, a search field, tabs, etc.)
  // pass `children` instead; when children is given, `title` is ignored
  // and the caller is fully responsible for the row's content.
  title?: string;
  showBackButton?: boolean;
  // Screens decide this themselves rather than the header guessing from
  // navigation state — a tab's own root screen (e.g. /reviews) never
  // wants one, while a screen pushed on top of it (e.g. /reviews/add)
  // always does. See frontend-work-style.md's router.back() convention.
  onBackPress?: () => void;
  // Must match the Container `variant` used below this header on the
  // same screen (narrow/desktop/full) — keeps the header row's content
  // aligned to the same max-width + centered column on web, instead of
  // stretching edge-to-edge while the screen content below sits centered.
  containerVariant?: ContainerVariant;
  className?: string;
}>;

export function ScreenHeader({
  title,
  showBackButton = false,
  onBackPress,
  containerVariant = "full",
  className = "",
  children,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  function handleBackPress() {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
    }
  }

  return (
    <View
      style={{ paddingTop: insets.top }}
      className={cn("w-full bg-background", className)}
    >
      <View className={cn("w-full mx-auto", VARIANT_CLASS[containerVariant])}>
        <View className="h-14 flex-row items-center gap-3 px-6">
          {showBackButton && (
            <Pressable
              onPress={handleBackPress}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="h-9 w-9 items-center justify-center rounded-full -ml-2"
            >
              <ArrowLeftIcon
                width={22}
                height={22}
                color="rgb(var(--color-foreground))"
              />
            </Pressable>
          )}

          {children ? (
            <View className="flex-1">{children}</View>
          ) : (
            title && (
              <Text variant="body-lg" className="flex-1 font-semibold">
                {title}
              </Text>
            )
          )}
        </View>
      </View>
    </View>
  );
}
