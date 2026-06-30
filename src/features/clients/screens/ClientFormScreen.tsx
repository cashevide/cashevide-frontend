import { router, useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ClientFormScreen() {
  const { clientSlug } = useLocalSearchParams<{ clientSlug?: string }>();

  const isEditMode = Boolean(clientSlug);

  function handleSaveTest() {
    const nextClientSlug = clientSlug ?? "test-client";

    router.replace({
      pathname: "/invoices/clients/[clientSlug]",
      params: { clientSlug: nextClientSlug },
    });
  }

  return (
    <View style={styles.container}>
      <Text>{isEditMode ? "Edit Client Screen" : "Create Client Screen"}</Text>

      {isEditMode ? (
        <Text>Editing Client Slug: {clientSlug}</Text>
      ) : (
        <Text>New client form will come here later</Text>
      )}

      <Text>Name, email, phone and address fields will come here later</Text>

      <Button
        title={isEditMode ? "Save Client Changes Test" : "Create Client Test"}
        onPress={handleSaveTest}
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
