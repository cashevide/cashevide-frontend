import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function BusinessProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>Invoice Business Profile Screen</Text>
      <Text>
        Business name, logo, address, tax number and currency will come here
        later
      </Text>

      <Button
        title="Edit Invoice Business Profile"
        onPress={() => router.push("/profile/business-edit")}
      />

      <Button title="Back to Profile" onPress={() => router.push("/profile")} />

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
