import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function GoogleUsernameScreen() {
  return (
    <View style={styles.container}>
      <Text>Google Username Screen</Text>
      <Text>Username input will come here later</Text>

      <Button
        title="Create Google Account Test"
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
