import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useUserProfile } from "@/src/features/profile/hooks/useUserProfile";
import { DeleteAccountModal } from "../components/DeleteAccountModal";

export default function AccountSettingsScreen() {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const profileQuery = useUserProfile();

  if (profileQuery.isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Account Settings Screen</Text>

      <Text>Username: {profileQuery.data?.username}</Text>
      <Text>Full Name: {profileQuery.data?.full_name}</Text>
      <Text>Email: {profileQuery.data?.email}</Text>

      <Button
        title="Delete Account"
        onPress={() => setIsDeleteModalVisible(true)}
      />

      <Button title="Back" onPress={() => router.back()} />

      <DeleteAccountModal
        visible={isDeleteModalVisible}
        username={profileQuery.data?.username ?? ""}
        onDismiss={() => setIsDeleteModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
