import { View, Text, StyleSheet } from "react-native";

export default function ReviewsPage() {
  return (
    <View style={styles.container}>
      <Text>Reviews page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
