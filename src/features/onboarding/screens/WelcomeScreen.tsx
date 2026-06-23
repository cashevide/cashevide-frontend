import { router } from "expo-router";
import { Button, View, StyleSheet, Text } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Welcome to Cashevide</Text>

      <Button
        title="Continue with Google"
        onPress={() => router.push("/signup/google")}
      />

      <Button
        title="Continue with Email"
        onPress={() => router.push("/signup/referral")}
      />

      <Button title="Login" onPress={() => router.push("/login")} />

      <View style={styles.legalBox}>
        <Text>By continuing, you agree to Cashevide</Text>

        <Button title="Terms" onPress={() => router.push("/legal/terms")} />

        <Button
          title="Privacy Policy"
          onPress={() => router.push("/legal/privacy-policy")}
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
