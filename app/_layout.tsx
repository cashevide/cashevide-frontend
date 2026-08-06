import "@/global.css";

import { Stack } from "expo-router";
import { AppProviders } from "@/src/providers/AppProviders";
import { AuthBootstrap } from "@/src/providers/AuthBootstrap";
import { LegalGate } from "@/src/providers/LegalGate";
import { useThemeSync } from "@/src/shared/hooks/useThemeSync";

export default function RootLayout() {
  useThemeSync();

  return (
    <AppProviders>
      <AuthBootstrap>
        <LegalGate>
          <Stack screenOptions={{ headerShown: false }} />
        </LegalGate>
      </AuthBootstrap>
    </AppProviders>
  );
}
