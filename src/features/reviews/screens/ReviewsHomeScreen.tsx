import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ReviewsHomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Reviews Home Screen</Text>

      <Button
        title="Open Client Summary"
        onPress={() => router.push("/reviews/test-client-id")}
      />

      <Button title="Add Review" onPress={() => router.push("/reviews/add")} />
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
