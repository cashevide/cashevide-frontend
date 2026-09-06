import { View } from "react-native";

import { useThemeStore } from "@/src/store/themeStore";
import { useMalayaliModeStore } from "@/src/store/malayaliModeStore";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Switch, Divider } from "@/src/shared/ui";

export default function AppSettingsScreen() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const isMalayaliMode = useMalayaliModeStore((state) => state.isMalayaliMode);
  const setMalayaliMode = useMalayaliModeStore(
    (state) => state.setMalayaliMode,
  );

  const isDarkMode = theme === "dark";

  function handleThemeToggle(value: boolean) {
    setTheme(value ? "dark" : "light");
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="App Settings"
        showBackButton
        containerVariant="narrow"
      />

      <Container variant="narrow" safeArea="bottom" scroll>
        <View className="w-full max-w-narrow mx-auto px-6 py-6 gap-6">
          {/* Same grouped-card row pattern as SettingsHomeScreen /
              SecuritySettingsScreen — both app-level preferences share
              one card, with a divider between them, rather than each
              being its own separate card. */}
          <View className="rounded-lg border border-border bg-card overflow-hidden">
            <View className="flex-row items-center justify-between py-3.5 px-4">
              <Text variant="body">Dark Mode</Text>
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                accessibilityLabel="Toggle dark mode"
              />
            </View>

            <View className="pl-4 pr-4">
              <Divider fade />
            </View>

            <View className="flex-row items-center justify-between py-3.5 px-4">
              <Text variant="body">Malayali Mode</Text>
              <Switch
                value={isMalayaliMode}
                onValueChange={setMalayaliMode}
                accessibilityLabel="Toggle Malayali mode"
              />
            </View>
          </View>
        </View>
      </Container>
    </View>
  );
}
