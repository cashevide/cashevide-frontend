import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import ProfileSubTabs from "@/src/features/profile/components/ProfileSubTabs";

export default function BusinessProfileScreen() {
  return (
    <View style={styles.container}>
      <ProfileSubTabs />

      <Text>Invoice Business Profile Screen</Text>
      <Text>
        Business name, logo, address, tax number and currency will come here
        later
      </Text>

      <Button
        title="Edit Invoice Business Profile"
        onPress={() => router.push("/profile/business-edit")}
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
