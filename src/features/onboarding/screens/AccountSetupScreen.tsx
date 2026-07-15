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

  return (
    <View style={styles.container}>
      <Text>Account Setup Screen</Text>

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

      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />

      {signupErrorMessages.map((message) => (
        <Text key={message} style={styles.error}>
          {message}
        </Text>
      ))}

      {signupMutation.isPending ? (
        <ActivityIndicator />
      ) : (
        <Button
          title="Create Account"
          onPress={handleCreateAccount}
          disabled={!canSubmit}
        />
      )}
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
