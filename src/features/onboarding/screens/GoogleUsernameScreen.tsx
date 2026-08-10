import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { AxiosError } from "axios";

import { Container } from "@/src/shared/layout/Container";
import { Text, Button, Input, Spinner } from "@/src/shared/ui";
import { useCheckUser } from "../hooks/useCheckUser";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { useGoogleAuthStore } from "@/src/store/googleAuthStore";

import type { GoogleAuthError } from "../types/googleAuthTypes";

export default function GoogleUsernameScreen() {
  const [username, setUsername] = useState("");

  const googleIdToken = useGoogleAuthStore((state) => state.googleIdToken);
  const referralCodeInput = useGoogleAuthStore(
    (state) => state.referralCodeInput,
  );

  const usernameCheck = useCheckUser("username", username);

  const { submitGoogleSignup, isPending, error } = useGoogleAuth();

  function handleCreateAccount() {
    submitGoogleSignup({
      google_id_token: googleIdToken,
      referral_code_input: referralCodeInput,
      username: username.trim(),
    });
  }

  const isUsernameAvailable = usernameCheck.data?.is_available === true;

  const googleAuthError = error as AxiosError<GoogleAuthError> | null;

  const errorMessages = googleAuthError?.response?.data
    ? Object.values(googleAuthError.response.data).flat()
    : [];

  const usernameMessage = usernameCheck.data
    ? {
        text: usernameCheck.data.is_available
          ? "Username is available."
          : "This username is already taken.",
        isSuccess: usernameCheck.data.is_available,
      }
    : null;

  if (isPending) {
    return (
      <Container variant="narrow" safeArea>
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </Container>
    );
  }

  const content = (
    <View className="flex-1 justify-center px-6 py-10 gap-8">
      <Text variant="subheading" className="text-center">
        Choose a username
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
              (usernameMessage && !usernameMessage.isSuccess
                ? usernameMessage.text
                : undefined) ?? errorMessages[0]
            }
          />

          {usernameCheck.isFetching ? (
            <View className="items-center">
              <Spinner size="sm" />
            </View>
          ) : null}

          {usernameMessage?.isSuccess ? (
            <Text variant="body-sm" className="text-success-text text-center">
              {usernameMessage.text}
            </Text>
          ) : null}
        </View>

        <View className="items-center">
          <Button
            variant="primary"
            title="Create Google Account"
            onPress={handleCreateAccount}
            disabled={!isUsernameAvailable}
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
