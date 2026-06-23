import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function PasswordResetEmailScreen() {
  return (
    <View style={styles.container}>
      <Text>Password Reset Email Screen</Text>
      <Text>Email field will come here later</Text>

      <Button
        title="Send OTP Test"
        onPress={() => router.push("/password-reset/otp")}
      />

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
});
