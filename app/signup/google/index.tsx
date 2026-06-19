import { router } from "expo-router";
import { Text, View, Button, StyleSheet } from "react-native";

export default function GoogleSignupIndexPage() {
  return (
    <View style={styles.container}>
      <Text>Google Signup / Login</Text>
      <Text>Google auth decision page</Text>

      <Button
        title="Test Existing Google User"
        onPress={() => router.replace("/reviews")}
      />

      <Button
        title="Test New Google User"
        onPress={() => router.push("/signup/google/referral")}
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
