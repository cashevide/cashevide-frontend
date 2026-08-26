import { Redirect } from "expo-router";

import { useAuthStore } from "@/src/store/authStore";
import { ROUTES } from "@/src/shared/navigation/routes";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href={ROUTES.home} />;
  }

  return <Redirect href={ROUTES.welcome} />;
}
