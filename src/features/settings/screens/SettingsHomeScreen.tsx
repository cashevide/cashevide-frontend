import { useState } from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { ChevronRightIcon } from "react-native-heroicons/outline";

import { useLogout } from "@/src/features/auth/hooks/useLogout";
import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Button, Divider, ConfirmDialog } from "@/src/shared/ui";

type SettingsMenuItem = {
  label: string;
  onPress: () => void;
};

function SettingsRow({ label, onPress }: SettingsMenuItem) {
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

export default function SettingsHomeScreen() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const logoutMutation = useLogout();

  const menuItems: SettingsMenuItem[] = [
    { label: "Account", onPress: () => router.push(ROUTES.settings.account) },
    {
      label: "Security",
      onPress: () => router.push(ROUTES.settings.security.entry),
    },
    { label: "Theme", onPress: () => router.push(ROUTES.settings.theme) },
    { label: "Legal", onPress: () => router.push(ROUTES.settings.legal) },
  ];

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Settings" containerVariant="desktop" />

      <Container variant="desktop" safeArea="bottom" scroll>
        <View className="w-full max-w-narrow mx-auto px-6 py-6 gap-6">
          {/* Grouped settings card — iOS/Material "grouped table" pattern:
              related rows share one card with dividers between them,
              rather than each row being its own separate card. */}
          <View className="rounded-lg border border-border bg-card overflow-hidden">
            {menuItems.map((item, index) => (
              <View key={item.label}>
                <SettingsRow label={item.label} onPress={item.onPress} />
                {index < menuItems.length - 1 && <Divider className="ml-4" />}
              </View>
            ))}
          </View>

          {/* Destructive/singleton action, visually separated from the
              grouped card below it — mirrors how iOS Settings keeps
              "Sign Out" as its own isolated card at the bottom. */}
          <Button
            variant="destructive"
            title="Logout"
            onPress={() => setShowLogoutConfirm(true)}
          />
        </View>
      </Container>

      <ConfirmDialog
        visible={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        destructive
        isConfirming={logoutMutation.isPending}
        onConfirm={() => logoutMutation.mutate()}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </View>
  );
}
