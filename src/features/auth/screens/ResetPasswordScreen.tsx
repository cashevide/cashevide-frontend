import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { AxiosError } from "axios";

import { Container } from "@/src/shared/layout/Container";
import { Text, Button, Input } from "@/src/shared/ui";
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

  const content = (
    <View className="flex-1 justify-center px-6 py-10 gap-8">
      <Text variant="subheading" className="text-center">
        Set a new password
      </Text>

      <View className="gap-4">
        <Input
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New Password"
          isPassword
          error={errorMessages[0]}
        />

        <View className="items-center">
          <Button
            variant="primary"
            title="Reset Password"
            onPress={handleResetPassword}
            disabled={newPassword.length === 0}
            isLoading={resetPasswordMutation.isPending}
          />
        </View>
      </View>
    </View>
  );

  if (Platform.OS === "web") {
    return (
      <Container variant="narrow" safeArea scroll>
        {content}
      </Container>
    );
  }

  return (
    <Container variant="narrow" safeArea>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    </Container>
  );
}
