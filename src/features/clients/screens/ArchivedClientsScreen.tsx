import { StyleSheet, Text, View } from "react-native";

export default function ArchivedClientsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Archived Clients</Text>
      <Text style={styles.subtitle}>Screen placeholder — routing check</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#666",
  },
});
