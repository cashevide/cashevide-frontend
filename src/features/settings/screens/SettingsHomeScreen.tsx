import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

import { useLogout } from "@/src/features/auth/hooks/useLogout";

export default function SettingsHomeScreen() {
  const logoutMutation = useLogout();

  return (
    <View style={styles.container}>
      <Text>Settings Home Screen</Text>

      <Button
        title="Account"
        onPress={() => router.push("/settings/account")}
      />

      <Button
        title="Security"
        onPress={() => router.push("/settings/security")}
      />

      <Button title="Theme" onPress={() => router.push("/settings/theme")} />

      <Button title="Legal" onPress={() => router.push("/settings/legal")} />

      <Button
        title="Logout Test"
        onPress={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
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
