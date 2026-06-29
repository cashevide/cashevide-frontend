import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function EditProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>Edit Personal Profile Screen</Text>
      <Text>
        Full name, profile picture, phone number and job title fields will come
        here later
      </Text>

      <Button
        title="Save Personal Profile Test"
        onPress={() => router.replace("/profile")}
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
