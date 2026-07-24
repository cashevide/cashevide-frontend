import { Redirect, Stack } from "expo-router";

import { useAuthStore } from "@/src/store/authStore";
import { ROUTES } from "@/src/shared/navigation/routes";

export default function SignupLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href={ROUTES.reviews} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
