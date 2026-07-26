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

import { useResetPassword } from "../hooks/useResetPassword";
import { usePasswordResetStore } from "@/src/store/passwordResetStore";

import type { ResetPasswordError } from "../types/passwordResetTypes";

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState("");

  const email = usePasswordResetStore((state) => state.email);

  const resetPasswordMutation = useResetPassword();

  function handleResetPassword() {
    resetPasswordMutation.mutate({
      email,
      new_password: newPassword,
    });
  }

  const resetPasswordError =
    resetPasswordMutation.error as AxiosError<ResetPasswordError> | null;

  const errorMessages = resetPasswordError?.response?.data
    ? Object.values(resetPasswordError.response.data).flat()
    : [];

  return (
    <View style={styles.container}>
      <Text>Reset Password Screen</Text>

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

      {resetPasswordMutation.isPending ? (
        <ActivityIndicator />
      ) : (
        <Button
          title="Reset Password"
          onPress={handleResetPassword}
          disabled={newPassword.length === 0}
        />
      )}
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
