import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  View,
  StyleSheet,
  Text,
} from "react-native";

import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { ROUTES } from "@/src/shared/navigation/routes";

export default function WelcomeScreen() {
  const [isNavigating, setIsNavigating] = useState(false);

  const { request, promptAsync, isPending } = useGoogleAuth({
    onBeforeNavigate: () => setIsNavigating(true),
  });

  const showLoading = isPending || isNavigating;

  if (showLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Welcome to Cashevide</Text>

      <Button
        title="Continue with Google"
        onPress={() => promptAsync()}
        disabled={!request}
      />

      <Button
        title="Continue with Email"
        onPress={() => router.push(ROUTES.signup.referral)}
      />

      <Button title="Login" onPress={() => router.push(ROUTES.login)} />

      <View style={styles.legalBox}>
        <Text>By continuing, you agree to Cashevide</Text>

        <Button title="Terms" onPress={() => router.push(ROUTES.legal.terms)} />

        <Button
          title="Privacy Policy"
          onPress={() => router.push(ROUTES.legal.privacyPolicy)}
        />
      </View>
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
  legalBox: {
    gap: 8,
    marginTop: 24,
    alignItems: "center",
  },
});
