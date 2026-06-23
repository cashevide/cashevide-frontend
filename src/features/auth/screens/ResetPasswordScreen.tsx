import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ResetPasswordScreen() {
  return (
    <View style={styles.container}>
      <Text>Reset Password Screen</Text>
      <Text>New password field will come here later</Text>

      <Button
        title="Reset Password Test"
        onPress={() => router.replace("/login")}
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
