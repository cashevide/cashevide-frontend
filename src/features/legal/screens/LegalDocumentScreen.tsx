import { router, useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function LegalDocumentScreen() {
  const { docType } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>Legal Document Screen</Text>
      <Text>Document Type: {docType}</Text>
      <Text>Markdown legal content will come here later</Text>

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
