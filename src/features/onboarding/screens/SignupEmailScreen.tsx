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

  return (
    <View style={styles.container}>
      <Text>Signup Email Screen</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      {showFormatError ? (
        <Text style={styles.error}>Enter a valid email address.</Text>
      ) : null}

      {isValidEmailFormat && emailCheck.isFetching ? (
        <ActivityIndicator />
      ) : null}

      {isValidEmailFormat && emailCheck.data ? (
        <Text
          style={emailCheck.data.is_available ? styles.success : styles.error}
        >
          {emailCheck.data.is_available
            ? "Email is available."
            : "This email is already registered."}
        </Text>
      ) : null}

      {requestOtpErrorMessages.map((message) => (
        <Text key={message} style={styles.error}>
          {message}
        </Text>
      ))}

      {isCooldownActive ? (
        <Text>
          An OTP was already sent to this email. You can enter it in{" "}
          {cooldownSeconds}s, or continue now.
        </Text>
      ) : null}

      {signupRequestOtpMutation.isPending ? (
        <ActivityIndicator />
      ) : (
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isCooldownActive && !canContinue}
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
  success: {
    color: "green",
  },
});
