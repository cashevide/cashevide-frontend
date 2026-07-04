import { Redirect, Stack, useSegments } from "expo-router";

import { useAuthStore } from "@/src/store/authStore";

export default function PublicLayout() {
  const segments = useSegments();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isLegalRoute = segments.includes("legal");

  if (isAuthenticated && !isLegalRoute) {
    return <Redirect href="/reviews" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
