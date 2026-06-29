import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ThemeSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Theme Settings Screen</Text>
      <Text>Theme store connection will come here later</Text>

      <Button title="System Theme" onPress={() => {}} />

      <Button title="Light Theme" onPress={() => {}} />

      <Button title="Dark Theme" onPress={() => {}} />

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
