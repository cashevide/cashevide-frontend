import { PropsWithChildren, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { refreshTokenApi } from "@/src/features/auth/api/tokenApi";
import { useAuthStore } from "@/src/store/authStore";
import { clearTokens } from "@/src/shared/utils/tokenStorage";

export function AuthBootstrap({ children }: PropsWithChildren) {
  const isBootstrapping = useAuthStore((state) => state.isBootstrapping);

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const setBootstrapping = useAuthStore((state) => state.setBootstrapping);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      try {
        await refreshTokenApi();

        if (!isMounted) {
          return;
        }

        setAuthenticated(true);
      } catch {
        await clearTokens();

        if (!isMounted) {
          return;
        }

        setAuthenticated(false);
      } finally {
        if (isMounted) {
          setBootstrapping(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [setAuthenticated, setBootstrapping]);

  if (isBootstrapping) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
