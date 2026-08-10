import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { AxiosError } from "axios";

import { Container } from "@/src/shared/layout/Container";
import { Text, Button, Input, Spinner } from "@/src/shared/ui";
import { useCheckUser } from "../hooks/useCheckUser";
import { useSignup } from "../hooks/useSignup";
import { useSignupStore } from "@/src/store/signupStore";

import type { SignupError } from "../types/signupTypes";

export default function AccountSetupScreen() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const email = useSignupStore((state) => state.email);
  const referralCodeInput = useSignupStore((state) => state.referralCodeInput);

  const usernameCheck = useCheckUser("username", username);

  const signupMutation = useSignup();

  function handleCreateAccount() {
    signupMutation.mutate({
      email,
      username: username.trim(),
      full_name: fullName.trim(),
      password,
      referral_code_input: referralCodeInput,
    });
  }

  const isUsernameAvailable = usernameCheck.data?.is_available === true;

  const canSubmit =
    isUsernameAvailable && fullName.trim().length > 0 && password.length > 0;

  const signupError = signupMutation.error as AxiosError<SignupError> | null;

  const signupErrorMessages = signupError?.response?.data
    ? Object.values(signupError.response.data).flat()
    : [];

  const usernameMessage = usernameCheck.data
    ? {
        text: usernameCheck.data.is_available
          ? "Username is available."
          : "This username is already taken.",
        isSuccess: usernameCheck.data.is_available,
      }
    : null;

  const content = (
    <View className="flex-1 justify-center px-6 py-10 gap-8">
      <Text variant="subheading" className="text-center">
        Set up your account
      </Text>

      <View className="gap-4">
        <View className="gap-2">
          <Input
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            autoCapitalize="none"
            isSuccess={usernameMessage?.isSuccess}
            error={
              usernameMessage && !usernameMessage.isSuccess
                ? usernameMessage.text
                : undefined
            }
          />

          {usernameCheck.isFetching ? (
            <View className="items-center">
              <Spinner size="sm" />
            </View>
          ) : null}

          {usernameMessage?.isSuccess ? (
            <Text variant="body-sm" className="text-success-text">
              {usernameMessage.text}
            </Text>
          ) : null}
        </View>

        <Input
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
        />

        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          isPassword
          error={signupErrorMessages[0]}
        />

        <View className="items-center">
          <Button
            variant="primary"
            title="Create Account"
            onPress={handleCreateAccount}
            disabled={!canSubmit}
            isLoading={signupMutation.isPending}
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
