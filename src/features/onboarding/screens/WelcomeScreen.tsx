import { router } from "expo-router";
import { Button, View, StyleSheet, Text } from "react-native";

import { ROUTES } from "@/src/shared/navigation/routes";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Welcome to Cashevide</Text>

      <Button
        title="Continue with Google"
        onPress={() => router.push(ROUTES.signup.google)}
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
