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

  return (
    <View style={styles.container}>
      <Text>Google Username Screen</Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
        style={styles.input}
      />

      {usernameCheck.isFetching ? <ActivityIndicator /> : null}

      {usernameCheck.data ? (
        <Text
          style={
            usernameCheck.data.is_available ? styles.success : styles.error
          }
        >
          {usernameCheck.data.is_available
            ? "Username is available."
            : "This username is already taken."}
        </Text>
      ) : null}

      {errorMessages.map((message) => (
        <Text key={message} style={styles.error}>
          {message}
        </Text>
      ))}

      {isPending ? (
        <ActivityIndicator />
      ) : (
        <Button
          title="Create Google Account"
          onPress={handleCreateAccount}
          disabled={!isUsernameAvailable}
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
