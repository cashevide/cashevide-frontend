import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

import { Container } from "@/src/shared/layout/Container";
import { Text, Button, Input, GoogleButton, Divider } from "@/src/shared/ui";
import { useLogin } from "../hooks/useLogin";
import { useGoogleAuth } from "@/src/features/onboarding/hooks/useGoogleAuth";
import { ROUTES } from "@/src/shared/navigation/routes";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const loginMutation = useLogin();
  const { request, promptAsync } = useGoogleAuth({});

  const trimmedEmail = email.trim();
  const isEmailValid =
    trimmedEmail.length === 0 || EMAIL_REGEX.test(trimmedEmail);
  const emailError =
    emailTouched && !isEmailValid ? "Enter a valid email address." : undefined;

  function handleLogin() {
    if (!isEmailValid || trimmedEmail.length === 0) {
      setEmailTouched(true);
      return;
    }

    loginMutation.mutate({
      email: trimmedEmail,
      password,
    });
  }

  const content = (
    <View className="flex-1 justify-center px-6 py-10 gap-8">
      <Text variant="subheading" className="text-center">
        Log in to your account
      </Text>

      <View className="gap-4">
        <View className="gap-3">
          <Input
            value={email}
            onChangeText={setEmail}
            onBlur={() => setEmailTouched(true)}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            error={emailError}
          />

          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            isPassword
            error={
              loginMutation.isError
                ? "Login failed. Please check your email and password."
                : undefined
            }
          />
        </View>

        <View className="items-center">
          <Text
            variant="link"
            onPress={() => router.push(ROUTES.passwordReset.entry)}
          >
            Forgot password?
          </Text>
        </View>

        <Button
          variant="primary"
          title="Log in"
          onPress={handleLogin}
          isLoading={loginMutation.isPending}
          fullWidth
        />

        <Divider label="or" />

        <GoogleButton onPress={() => promptAsync()} disabled={!request} />
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
