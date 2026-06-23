import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function PasswordResetOtpScreen() {
  return (
    <View style={styles.container}>
      <Text>Password Reset OTP Screen</Text>
      <Text>OTP field will come here later</Text>

      <Button
        title="Verify OTP Test"
        onPress={() => router.push("/password-reset/reset")}
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
