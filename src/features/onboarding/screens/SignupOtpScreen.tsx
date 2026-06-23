import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function SignupOtpScreen() {
  return (
    <View style={styles.container}>
      <Text>Signup OTP Screen</Text>
      <Text>OTP input will come here later</Text>

      <Button
        title="Verify OTP Test"
        onPress={() => router.push("/signup/account")}
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
