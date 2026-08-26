import { Redirect, Stack, useSegments } from "expo-router";

import { useAuthStore } from "@/src/store/authStore";
import { ROUTES } from "@/src/shared/navigation/routes";

export default function PublicLayout() {
  const segments = useSegments();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isLegalRoute = segments.includes("legal");
  const isDesignSystemRoute = segments.includes("design-system");

  if (isAuthenticated && !isLegalRoute && !isDesignSystemRoute) {
    return <Redirect href={ROUTES.home} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
