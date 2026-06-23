import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function GoogleAuthEntryScreen() {
  return (
    <View style={styles.container}>
      <Text>Google Auth Entry Screen</Text>
      <Text>Google login/signup decision will happen here later</Text>

      <Button
        title="Existing Google User Test"
        onPress={() => router.replace("/reviews")}
      />

      <Button
        title="New Google User Test"
        onPress={() => router.push("/signup/google/referral")}
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
