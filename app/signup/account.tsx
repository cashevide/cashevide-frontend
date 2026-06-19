import { router } from "expo-router";
import { View, Text, StyleSheet, Button } from "react-native";

export default function AccountPage() {
  return (
    <View style={styles.container}>
      <Text>Account page</Text>
      <Button title="Create Account" onPress={() => router.push("/reviews")} />
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
