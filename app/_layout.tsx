import { Stack } from "expo-router";

import { AppProviders } from "@/src/providers/AppProviders";
import { AuthBootstrap } from "@/src/providers/AuthBootstrap";
import { LegalGate } from "@/src/providers/LegalGate";

export default function RootLayout() {
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
