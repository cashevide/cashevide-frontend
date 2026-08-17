import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

import { useChangePassword } from "../hooks/useChangePassword";
import { useUserProfile } from "@/src/features/profile/hooks/useUserProfile";
import { getFieldErrorMessage } from "@/src/shared/api/errors";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Input, Button, Spinner } from "@/src/shared/ui";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const profileQuery = useUserProfile();
  const changePasswordMutation = useChangePassword();

  const hasPassword = profileQuery.data?.has_password ?? true;

  function handleChangePassword() {
    changePasswordMutation.mutate({
      current_password: hasPassword ? currentPassword : undefined,
      new_password: newPassword,
    });
  }

  const errorMessage = changePasswordMutation.isError
    ? getFieldErrorMessage(changePasswordMutation.error)
    : undefined;

  const canSubmit =
    (!hasPassword || currentPassword.length > 0) && newPassword.length > 0;

  if (profileQuery.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Change Password"
          showBackButton
          containerVariant="narrow"
        />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  const content = (
    <View className="flex-1 justify-center px-6 py-10 gap-8">
      <Text variant="subheading" className="text-center">
        {hasPassword ? "Change your password" : "Set a password"}
      </Text>

      <View className="gap-4">
        {hasPassword && (
          <Input
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current Password"
            isPassword
          />
        )}

        <Input
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New Password"
          isPassword
          error={errorMessage}
        />

        <View className="items-center">
          <Button
            variant="primary"
            title={hasPassword ? "Change Password" : "Set Password"}
            onPress={handleChangePassword}
            disabled={!canSubmit}
            isLoading={changePasswordMutation.isPending}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Change Password"
        showBackButton
        containerVariant="narrow"
      />

      {Platform.OS === "web" ? (
        <Container variant="narrow" safeArea="bottom" scroll>
          {content}
        </Container>
      ) : (
        <Container variant="narrow" safeArea="bottom">
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            {content}
          </KeyboardAvoidingView>
        </Container>
      )}
    </View>
  );
}
