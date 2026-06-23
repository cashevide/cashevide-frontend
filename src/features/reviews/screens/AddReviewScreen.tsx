import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function AddReviewScreen() {
  return (
    <View style={styles.container}>
      <Text>Add Review Screen</Text>
      <Text>Rating and tags will come here later</Text>

      <Button title="Submit Test" onPress={() => router.replace("/reviews")} />

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
