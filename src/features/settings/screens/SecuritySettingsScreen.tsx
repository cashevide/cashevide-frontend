import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { ChevronRightIcon } from "react-native-heroicons/outline";

import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text } from "@/src/shared/ui";

type SecurityMenuItem = {
  label: string;
  onPress: () => void;
};

function SecurityRow({ label, onPress }: SecurityMenuItem) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-3.5 px-4 active:opacity-60"
    >
      <Text variant="body">{label}</Text>
      <ChevronRightIcon
        width={18}
        height={18}
        color="rgb(var(--color-muted-foreground))"
      />
    </Pressable>
  );
}

export default function SecuritySettingsScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Security"
        showBackButton
        containerVariant="desktop"
      />

      <Container variant="desktop" safeArea="bottom" scroll>
        <View className="w-full max-w-narrow mx-auto px-6 py-6 gap-6">
          {/* Same grouped-card pattern as SettingsHomeScreen — one row
              today, but built to hold more (2FA, login history, etc.)
              without restructuring. */}
          <View className="rounded-lg border border-border bg-card overflow-hidden">
            <SecurityRow
              label="Change Password"
              onPress={() =>
                router.push(ROUTES.settings.security.changePassword)
              }
            />
          </View>
        </View>
      </Container>
    </View>
  );
}
