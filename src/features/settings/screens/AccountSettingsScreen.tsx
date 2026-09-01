import { useState } from "react";
import { View } from "react-native";
import {
  IdentificationIcon,
  UserIcon,
  EnvelopeIcon,
} from "react-native-heroicons/outline";

import { useUserProfile } from "@/src/features/profile/hooks/useUserProfile";
import { DeleteAccountModal } from "../components/DeleteAccountModal";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Button, Spinner, InfoListRow } from "@/src/shared/ui";

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
        {/* Was missing the Container wrapper — on web the spinner would
            center across the full screen width instead of the same
            narrow column the loaded content below renders in. */}
        <Container variant="desktop" safeArea="bottom">
          <View className="flex-1 items-center justify-center">
            <Spinner />
          </View>
        </Container>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Account" showBackButton containerVariant="desktop" />

      <Container variant="desktop" safeArea="bottom" scroll>
        <View className="w-full max-w-narrow mx-auto px-6 py-6 gap-6">
          <View className="bg-card border border-border rounded-lg px-4">
            <InfoListRow
              icon={IdentificationIcon}
              label="Username"
              value={profileQuery.data?.username}
            />
            <InfoListRow
              icon={UserIcon}
              label="Full Name"
              value={profileQuery.data?.full_name}
            />
            <InfoListRow
              icon={EnvelopeIcon}
              label="Email"
              value={profileQuery.data?.email}
              isLast
            />
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
