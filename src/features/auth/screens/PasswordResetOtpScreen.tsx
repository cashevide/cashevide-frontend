import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AxiosError } from "axios";

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

  return (
    <View style={styles.container}>
      <Text>Password Reset OTP Screen</Text>
      <Text>OTP sent to {email}</Text>

      <TextInput
        value={otp}
        onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        style={styles.input}
      />

      {verifyOtpErrorMessages.map((message) => (
        <Text key={message} style={styles.error}>
          {message}
        </Text>
      ))}

      {verifyOtpMutation.isPending ? (
        <ActivityIndicator />
      ) : (
        <Button
          title="Verify OTP"
          onPress={handleVerify}
          disabled={!isOtpComplete}
        />
      )}

      <View style={styles.resendRow}>
        {cooldownSeconds > 0 ? (
          <Text>Resend OTP in {cooldownSeconds}s</Text>
        ) : null}

        {resendOtpMutation.isPending ? (
          <ActivityIndicator />
        ) : (
          <Pressable onPress={handleResend} disabled={!canResend}>
            <Text style={canResend ? styles.linkActive : styles.linkDisabled}>
              Resend OTP
            </Text>
          </Pressable>
        )}
      </View>

      {resendOtpErrorMessages.map((message) => (
        <Text key={message} style={styles.error}>
          {message}
        </Text>
      ))}

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
  resendRow: {
    alignItems: "center",
    gap: 4,
  },
  linkActive: {
    color: "blue",
  },
  linkDisabled: {
    color: "gray",
  },
  error: {
    color: "red",
  },
});
