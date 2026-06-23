import { router, useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ReviewedClientSummaryScreen() {
  const { reviewedClientId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>Reviewed Client Summary Screen</Text>
      <Text>Client ID: {reviewedClientId}</Text>

      <Button title="Add Review" onPress={() => router.push("/reviews/add")} />

      <Button
        title="Edit Review"
        onPress={() => router.push(`/reviews/${reviewedClientId}/edit`)}
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
