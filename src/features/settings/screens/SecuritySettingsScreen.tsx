import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function SecuritySettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Security Settings Screen</Text>
      <Text>Change password form will come here later</Text>

      <Button
        title="Change Password Test"
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
