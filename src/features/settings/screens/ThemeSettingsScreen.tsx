import { View } from "react-native";

import { useThemeStore } from "@/src/store/themeStore";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Switch } from "@/src/shared/ui";

export default function ThemeSettingsScreen() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const isDarkMode = theme === "dark";

  function handleToggle(value: boolean) {
    setTheme(value ? "dark" : "light");
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Theme" showBackButton containerVariant="narrow" />

      <Container variant="narrow" safeArea="bottom" scroll>
        <View className="w-full max-w-narrow mx-auto px-6 py-6 gap-6">
          {/* Same grouped-card row pattern as SettingsHomeScreen /
              SecuritySettingsScreen — a single row here, styled to
              match the rest of the settings screens. */}
          <View className="rounded-lg border border-border bg-card overflow-hidden">
            <View className="flex-row items-center justify-between py-3.5 px-4">
              <Text variant="body">Dark Mode</Text>
              <Switch
                value={isDarkMode}
                onValueChange={handleToggle}
                accessibilityLabel="Toggle dark mode"
              />
            </View>
          </View>
        </View>
      </Container>
    </View>
  );
}
