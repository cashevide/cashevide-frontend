import { router } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

export default function GoogleUsernamePage() {
  return (
    <View style={styles.container}>
      <Text>Google Signup</Text>
      <Text>Choose Username</Text>

      <Button
        title="Create Account"
        onPress={() => router.replace("/reviews")}
      />
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
