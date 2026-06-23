import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function SignupEmailScreen() {
  return (
    <View style={styles.container}>
      <Text>Signup Email Screen</Text>
      <Text>Email input will come here later</Text>

      <Button
        title="Send OTP Test"
        onPress={() => router.push("/signup/otp")}
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
