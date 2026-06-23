import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <Text>Email and password fields will come here later</Text>

      <Button title="Login Test" onPress={() => router.replace("/reviews")} />

      <Button
        title="Forgot Password"
        onPress={() => router.push("/password-reset")}
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
