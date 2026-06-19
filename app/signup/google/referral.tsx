import { router } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

export default function GoogleReferralPage() {
  return (
    <View style={styles.container}>
      <Text>Google Signup</Text>
      <Text>Enter Referral Code</Text>

      <Button
        title="Continue"
        onPress={() => router.push("/signup/google/username")}
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
