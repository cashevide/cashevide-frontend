import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function AccountSetupScreen() {
  return (
    <View style={styles.container}>
      <Text>Account Setup Screen</Text>
      <Text>Username, full name and password fields will come here later</Text>

      <Button
        title="Create Account Test"
        onPress={() => router.replace("/reviews")}
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
