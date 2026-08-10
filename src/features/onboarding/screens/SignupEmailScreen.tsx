import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { AxiosError } from "axios";

import { Container } from "@/src/shared/layout/Container";
import { Text, Button, Input, Spinner } from "@/src/shared/ui";
import { useCheckUser } from "../hooks/useCheckUser";
import { useSignupRequestOtp } from "../hooks/useSignupRequestOtp";
import { useCountdown } from "@/src/shared/hooks/useCountdown";
import { useDebouncedValue } from "@/src/shared/hooks/useDebouncedValue";
import { useSignupStore } from "@/src/store/signupStore";
import { ROUTES } from "@/src/shared/navigation/routes";

import type { SignupRequestOtpError } from "../types/signupTypes";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupEmailScreen() {
  const [email, setEmail] = useState("");

  const debouncedEmail = useDebouncedValue(email, 500);

  const isValidEmailFormat = EMAIL_REGEX.test(email.trim());
  const isDebouncedValidEmailFormat = EMAIL_REGEX.test(debouncedEmail.trim());

  const isTypingPending = email !== debouncedEmail;

  const showFormatError =
    !isTypingPending &&
    debouncedEmail.length > 0 &&
    !isDebouncedValidEmailFormat;

  const emailCheck = useCheckUser("email", isValidEmailFormat ? email : "");

  const signupRequestOtpMutation = useSignupRequestOtp();

  const storedEmail = useSignupStore((state) => state.email);
  const otpCooldownUntil = useSignupStore((state) => state.otpCooldownUntil);

  const cooldownSeconds = useCountdown(otpCooldownUntil);

  const isSameEmailAsStored =
    email.trim().toLowerCase() === storedEmail.toLowerCase() &&
    storedEmail.length > 0;

  const isCooldownActive = cooldownSeconds > 0 && isSameEmailAsStored;

  function handleContinue() {
    if (isCooldownActive) {
      router.push(ROUTES.signup.otp);

      return;
    }

    signupRequestOtpMutation.mutate({ email: email.trim() });
  }

  const canContinue =
    isValidEmailFormat && emailCheck.data?.is_available === true;

  const requestOtpError =
    signupRequestOtpMutation.error as AxiosError<SignupRequestOtpError> | null;

  const requestOtpErrorMessages = requestOtpError?.response?.data
    ? Object.values(requestOtpError.response.data).flat()
    : [];

  const availabilityMessage =
    isValidEmailFormat && emailCheck.data
      ? {
          text: emailCheck.data.is_available
            ? "Email is available."
            : "This email is already registered.",
          isSuccess: emailCheck.data.is_available,
        }
      : null;

  const emailError = showFormatError
    ? "Enter a valid email address."
    : availabilityMessage && !availabilityMessage.isSuccess
      ? availabilityMessage.text
      : requestOtpErrorMessages[0];

  const content = (
    <View className="flex-1 justify-center px-6 py-10 gap-8">
      <Text variant="subheading" className="text-center">
        What's your email?
      </Text>

      <View className="gap-4">
        <View className="gap-2">
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            isSuccess={availabilityMessage?.isSuccess}
            error={emailError}
          />

          {isValidEmailFormat && emailCheck.isFetching ? (
            <View className="items-center">
              <Spinner size="sm" />
            </View>
          ) : null}

          {availabilityMessage?.isSuccess ? (
            <Text variant="body-sm" className="text-success-text">
              {availabilityMessage.text}
            </Text>
          ) : null}

          {isCooldownActive ? (
            <Text variant="body-sm" className="text-center">
              An OTP was already sent to this email. You can enter it in{" "}
              {cooldownSeconds}s, or continue now.
            </Text>
          ) : null}
        </View>

        <View className="items-center">
          <Button
            variant="primary"
            title="Continue"
            onPress={handleContinue}
            disabled={!isCooldownActive && !canContinue}
            isLoading={signupRequestOtpMutation.isPending}
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
