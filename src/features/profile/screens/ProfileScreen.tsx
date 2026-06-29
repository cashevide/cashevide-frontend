import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Text>
        Personal profile and invoice business profile cards will come here later
      </Text>

      <Button
        title="Edit Personal Profile"
        onPress={() => router.push("/profile/edit")}
      />

      <Button
        title="View Invoice Business Profile"
        onPress={() => router.push("/profile/business")}
      />

      <Button
        title="Set Up Business Profile"
        onPress={() => router.push("/profile/business-edit")}
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
