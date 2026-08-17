import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { ChevronRightIcon } from "react-native-heroicons/outline";

import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Divider } from "@/src/shared/ui";

type LegalMenuItem = {
  label: string;
  onPress: () => void;
};

function LegalRow({ label, onPress }: LegalMenuItem) {
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

export default function LegalSettingsScreen() {
  const menuItems: LegalMenuItem[] = [
    {
      label: "Terms of Service",
      onPress: () => router.push(ROUTES.legal.terms),
    },
    {
      label: "Privacy Policy",
      onPress: () => router.push(ROUTES.legal.privacyPolicy),
    },
  ];

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Legal" showBackButton containerVariant="narrow" />

      <Container variant="narrow" safeArea="bottom" scroll>
        <View className="w-full max-w-narrow mx-auto px-6 py-6 gap-6">
          <View className="rounded-lg border border-border bg-card overflow-hidden">
            {menuItems.map((item, index) => (
              <View key={item.label}>
                <LegalRow label={item.label} onPress={item.onPress} />
                {index < menuItems.length - 1 && <Divider className="ml-4" />}
              </View>
            ))}
          </View>
        </View>
      </Container>
    </View>
  );
}
