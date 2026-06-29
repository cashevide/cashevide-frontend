import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function LegalSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Legal Settings Screen</Text>
      <Text>Terms and Privacy Policy links</Text>

      <Button title="Terms" onPress={() => router.push("/legal/terms")} />

      <Button
        title="Privacy Policy"
        onPress={() => router.push("/legal/privacy-policy")}
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
