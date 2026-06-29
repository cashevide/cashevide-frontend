import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function AccountSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Account Settings Screen</Text>
      <Text>
        Email, username, referral code and credit points will come here later
      </Text>

      <Button title="Go to Profile" onPress={() => router.push("/profile")} />

      <Button title="Delete Account Test" onPress={() => {}} />

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
