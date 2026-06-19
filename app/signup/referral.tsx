import { router } from "expo-router";
import { Button, Text, View, StyleSheet } from "react-native";

export default function ReferralScreen() {
  return (
    <View style={styles.container}>
      <Text>Referral Code</Text>

      <Button title="Continue" onPress={() => router.push("/signup/email")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
