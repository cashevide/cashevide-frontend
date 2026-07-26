import { PropsWithChildren } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useAuthStore } from "@/src/store/authStore";
import { usePendingAgreements } from "@/src/features/legal/hooks/usePendingAgreements";
import { PendingAgreementsModal } from "@/src/features/legal/components/PendingAgreementsModal";

export function LegalGate({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { hasPendingAgreements, pendingLegalDocs, isLoading } =
    usePendingAgreements({ enabled: isAuthenticated });

  if (isAuthenticated && isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      {children}

      <PendingAgreementsModal
        visible={isAuthenticated && hasPendingAgreements}
        pendingLegalDocs={pendingLegalDocs}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
