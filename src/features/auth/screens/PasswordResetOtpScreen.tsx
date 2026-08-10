import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { AxiosError } from "axios";

import { Container } from "@/src/shared/layout/Container";
import { Text, Button, OtpInput, Spinner } from "@/src/shared/ui";
import { useVerifyPasswordResetOtp } from "../hooks/useVerifyPasswordResetOtp";
import { useRequestPasswordResetOtp } from "../hooks/useRequestPasswordResetOtp";
import { useCountdown } from "@/src/shared/hooks/useCountdown";
import { usePasswordResetStore } from "@/src/store/passwordResetStore";

import type {
  PasswordResetRequestOtpError,
  PasswordResetVerifyOtpError,
} from "../types/passwordResetTypes";

const OTP_LENGTH = 6;

export default function PasswordResetOtpScreen() {
  const [otp, setOtp] = useState("");

  const email = usePasswordResetStore((state) => state.email);
  const otpCooldownUntil = usePasswordResetStore(
    (state) => state.otpCooldownUntil,
  );

  const cooldownSeconds = useCountdown(otpCooldownUntil);

  const verifyOtpMutation = useVerifyPasswordResetOtp();

  const resendOtpMutation = useRequestPasswordResetOtp({
    navigateOnSuccess: false,
  });

  function handleVerify() {
    verifyOtpMutation.mutate({ email, otp: otp.trim() });
  }

  function handleResend() {
    resendOtpMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setOtp("");
          verifyOtpMutation.reset();
        },
      },
    );
  }

  const isOtpComplete = otp.trim().length === OTP_LENGTH;

  const canResend = cooldownSeconds === 0 && !resendOtpMutation.isPending;

  const verifyOtpError =
    verifyOtpMutation.error as AxiosError<PasswordResetVerifyOtpError> | null;

  const verifyOtpErrorMessages = verifyOtpError?.response?.data
    ? Object.values(verifyOtpError.response.data).flat()
    : [];

  const resendOtpError =
    resendOtpMutation.error as AxiosError<PasswordResetRequestOtpError> | null;

  const resendOtpErrorMessages = resendOtpError?.response?.data
    ? Object.values(resendOtpError.response.data).flat()
    : [];

  const content = (
    <View className="flex-1 justify-center px-6 py-10 gap-8">
      <View className="gap-2">
        <Text variant="subheading" className="text-center">
          Enter the code
        </Text>
        <Text variant="body-sm" className="text-center">
          OTP sent to {email}
        </Text>
      </View>

      <View className="gap-4">
        <OtpInput
          value={otp}
          onChangeText={setOtp}
          error={verifyOtpErrorMessages.length > 0}
          autoFocus
        />

        {verifyOtpErrorMessages[0] ? (
          <Text variant="body-sm" className="text-destructive-text text-center">
            {verifyOtpErrorMessages[0]}
          </Text>
        ) : null}

        <View className="items-center">
          <Button
            variant="primary"
            title="Verify OTP"
            onPress={handleVerify}
            disabled={!isOtpComplete}
            isLoading={verifyOtpMutation.isPending}
          />
        </View>

        <View className="items-center gap-1">
          {cooldownSeconds > 0 ? (
            <Text variant="body-sm">Resend OTP in {cooldownSeconds}s</Text>
          ) : null}

          {resendOtpMutation.isPending ? (
            <Spinner size="sm" />
          ) : (
            <Text
              variant="link"
              className={canResend ? "" : "text-muted-foreground"}
              onPress={canResend ? handleResend : undefined}
            >
              Resend OTP
            </Text>
          )}

          {resendOtpErrorMessages[0] ? (
            <Text variant="body-sm" className="text-destructive-text">
              {resendOtpErrorMessages[0]}
            </Text>
          ) : null}
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
