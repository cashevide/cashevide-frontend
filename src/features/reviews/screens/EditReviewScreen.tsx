import { router, useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function EditReviewScreen() {
  const { reviewedClientId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>Edit Review Screen</Text>
      <Text>Client ID: {reviewedClientId}</Text>
      <Text>Edit rating and tags will come here later</Text>

      <Button
        title="Save Test"
        onPress={() => router.replace(`/reviews/${reviewedClientId}`)}
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
