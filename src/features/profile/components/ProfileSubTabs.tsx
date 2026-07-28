import { router } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

export default function ProfileSubTabs() {
  return (
    <View style={styles.container}>
      <Button title="Personal" onPress={() => router.push("/profile")} />
      <Button
        title="Business"
        onPress={() => router.push("/profile/business")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
});
