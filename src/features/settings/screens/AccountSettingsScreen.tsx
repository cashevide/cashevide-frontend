import { useState } from "react";
import { View } from "react-native";

import { useUserProfile } from "@/src/features/profile/hooks/useUserProfile";
import { DeleteAccountModal } from "../components/DeleteAccountModal";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Button, Spinner } from "@/src/shared/ui";

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <View className="gap-0.5">
      <Text variant="caption">{label}</Text>
      <Text variant="body">{value}</Text>
    </View>
  );
}

export default function AccountSettingsScreen() {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const profileQuery = useUserProfile();

  if (profileQuery.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Account"
          showBackButton
          containerVariant="desktop"
        />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Account" showBackButton containerVariant="desktop" />

      <Container variant="desktop" safeArea="bottom" scroll>
        <View className="w-full max-w-narrow mx-auto px-6 py-6 gap-6">
          <View className="bg-card border border-border rounded-lg p-4 gap-4">
            <InfoRow label="Username" value={profileQuery.data?.username} />
            <InfoRow label="Full Name" value={profileQuery.data?.full_name} />
            <InfoRow label="Email" value={profileQuery.data?.email} />
          </View>

          <Button
            variant="destructive"
            title="Delete Account"
            onPress={() => setIsDeleteModalVisible(true)}
          />
        </View>
      </Container>

      <DeleteAccountModal
        visible={isDeleteModalVisible}
        username={profileQuery.data?.username ?? ""}
        onDismiss={() => setIsDeleteModalVisible(false)}
      />
    </View>
  );
}
