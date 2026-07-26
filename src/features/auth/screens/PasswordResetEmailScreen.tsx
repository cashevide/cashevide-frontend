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

import { useRequestPasswordResetOtp } from "../hooks/useRequestPasswordResetOtp";
import { useCountdown } from "@/src/shared/hooks/useCountdown";
import { usePasswordResetStore } from "@/src/store/passwordResetStore";
import { ROUTES } from "@/src/shared/navigation/routes";

import type { PasswordResetRequestOtpError } from "../types/passwordResetTypes";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PasswordResetEmailScreen() {
  const [email, setEmail] = useState("");

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

    requestOtpMutation.mutate({ email: email.trim() });
  }

  const requestOtpError =
    requestOtpMutation.error as AxiosError<PasswordResetRequestOtpError> | null;

  const errorMessages = requestOtpError?.response?.data
    ? Object.values(requestOtpError.response.data).flat()
    : [];

  return (
    <View style={styles.container}>
      <Text>Password Reset Email Screen</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      {errorMessages.map((message) => (
        <Text key={message} style={styles.error}>
          {message}
        </Text>
      ))}

      {isCooldownActive ? (
        <Text>You can enter it in {cooldownSeconds}s, or continue now.</Text>
      ) : null}

      {requestOtpMutation.isPending ? (
        <ActivityIndicator />
      ) : (
        <Button
          title="Send OTP"
          onPress={handleContinue}
          disabled={!isCooldownActive && !isValidEmailFormat}
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
