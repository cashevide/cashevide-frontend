import { Stack } from "expo-router";

import { AppProviders } from "@/src/providers/AppProviders";
import { AuthBootstrap } from "@/src/providers/AuthBootstrap";

export default function RootLayout() {
  return (
    <AppProviders>
      <AuthBootstrap>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthBootstrap>
    </AppProviders>
  );
}
