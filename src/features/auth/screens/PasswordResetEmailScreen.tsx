import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { AxiosError } from "axios";

import { Container } from "@/src/shared/layout/Container";
import { Text, Button, Input } from "@/src/shared/ui";
import { useRequestPasswordResetOtp } from "../hooks/useRequestPasswordResetOtp";
import { useCountdown } from "@/src/shared/hooks/useCountdown";
import { usePasswordResetStore } from "@/src/store/passwordResetStore";
import { ROUTES } from "@/src/shared/navigation/routes";

import type { PasswordResetRequestOtpError } from "../types/passwordResetTypes";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PasswordResetEmailScreen() {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const isValidEmailFormat = EMAIL_REGEX.test(email.trim());

  const requestOtpMutation = useRequestPasswordResetOtp();

  const storedEmail = usePasswordResetStore((state) => state.email);
  const otpCooldownUntil = usePasswordResetStore(
    (state) => state.otpCooldownUntil,
  );

  const cooldownSeconds = useCountdown(otpCooldownUntil);

  const isSameEmailAsStored =
    email.trim().toLowerCase() === storedEmail.toLowerCase() &&
    storedEmail.length > 0;

  const isCooldownActive = cooldownSeconds > 0 && isSameEmailAsStored;

  function handleContinue() {
    if (isCooldownActive) {
      router.push(ROUTES.passwordReset.otp);

      return;
    }

    if (!isValidEmailFormat) {
      setEmailTouched(true);
      return;
    }

    requestOtpMutation.mutate({ email: email.trim() });
  }

  const requestOtpError =
    requestOtpMutation.error as AxiosError<PasswordResetRequestOtpError> | null;

  const errorMessages = requestOtpError?.response?.data
    ? Object.values(requestOtpError.response.data).flat()
    : [];

  const emailFormatError =
    emailTouched && email.trim().length > 0 && !isValidEmailFormat
      ? "Enter a valid email address."
      : undefined;

  const emailError = emailFormatError ?? errorMessages[0];

  const content = (
    <View className="flex-1 justify-center px-6 py-10 gap-8">
      <Text variant="subheading" className="text-center">
        Reset your password
      </Text>

      <View className="gap-4">
        <Input
          value={email}
          onChangeText={setEmail}
          onBlur={() => setEmailTouched(true)}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          error={emailError}
        />

        {isCooldownActive ? (
          <Text variant="body-sm" className="text-center">
            You can enter it in {cooldownSeconds}s, or continue now.
          </Text>
        ) : null}

        <Button
          variant="primary"
          title="Send OTP"
          onPress={handleContinue}
          disabled={!isCooldownActive && !isValidEmailFormat}
          isLoading={requestOtpMutation.isPending}
          fullWidth
        />
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
