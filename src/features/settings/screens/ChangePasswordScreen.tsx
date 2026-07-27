import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AxiosError } from "axios";

import { useChangePassword } from "../hooks/useChangePassword";
import { useUserProfile } from "@/src/features/profile/hooks/useUserProfile";

import type { ChangePasswordError } from "../types/securitySettingsTypes";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const profileQuery = useUserProfile();

  const changePasswordMutation = useChangePassword();

  function handleChangePassword() {
    changePasswordMutation.mutate({
      current_password: hasPassword ? currentPassword : undefined,
      new_password: newPassword,
    });
  }

  const changePasswordError =
    changePasswordMutation.error as AxiosError<ChangePasswordError> | null;

  const errorData = changePasswordError?.response?.data;

  const errorMessages: string[] = [
    ...(errorData?.detail ?? []),
    ...(errorData?.new_password ?? []),
  ];

  const hasPassword = profileQuery.data?.has_password ?? true;

  const canSubmit =
    (!hasPassword || currentPassword.length > 0) && newPassword.length > 0;

  if (profileQuery.isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Change Password Screen</Text>

      {hasPassword ? (
        <TextInput
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Current Password"
          secureTextEntry
          style={styles.input}
        />
      ) : null}

      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New Password"
        secureTextEntry
        style={styles.input}
      />

      {errorMessages.map((message) => (
        <Text key={message} style={styles.error}>
          {message}
        </Text>
      ))}

      {changePasswordMutation.isPending ? (
        <ActivityIndicator />
      ) : (
        <Button
          title={hasPassword ? "Change Password" : "Set Password"}
          onPress={handleChangePassword}
          disabled={!canSubmit}
        />
      )}

      <Button title="Back" onPress={() => router.back()} />
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
  input: {
    width: "100%",
    maxWidth: 360,
    borderWidth: 1,
    borderColor: "#999",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  error: {
    color: "red",
  },
});
