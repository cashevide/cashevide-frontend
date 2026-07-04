import { Redirect, Stack } from "expo-router";

import { useAuthStore } from "@/src/store/authStore";

export default function PublicLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/reviews" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
