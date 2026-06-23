import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function GoogleReferralCodeScreen() {
  return (
    <View style={styles.container}>
      <Text>Google Referral Code Screen</Text>
      <Text>Referral code input will come here later</Text>

      <Button
        title="Continue Test"
        onPress={() => router.push("/signup/google/username")}
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
