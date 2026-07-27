import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

import { ROUTES } from "@/src/shared/navigation/routes";

export default function SecuritySettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Security Settings Screen</Text>

      <Button
        title="Change Password"
        onPress={() => router.push(ROUTES.settings.security.changePassword)}
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
