import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function EditBusinessProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>Edit Invoice Business Profile Screen</Text>
      <Text>
        Logo, business name, address, GST/VAT, website and currency fields will
        come here later
      </Text>

      <Button
        title="Save Business Profile Test"
        onPress={() => router.replace("/profile/business")}
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
