import { router, useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ClientDetailsScreen() {
  const { clientSlug } = useLocalSearchParams<{ clientSlug: string }>();

  return (
    <View style={styles.container}>
      <Text>Client Details Screen</Text>
      <Text>Client Slug: {clientSlug}</Text>
      <Text>Client name, email, phone and address will come here later</Text>

      <Button
        title="Edit Client"
        onPress={() =>
          router.push({
            pathname: "/invoices/clients/[clientSlug]/edit",
            params: { clientSlug },
          })
        }
      />

      <Button
        title="Delete Client Test"
        onPress={() => router.replace("/invoices/clients")}
      />

      <Button
        title="Back to Clients"
        onPress={() => router.push("/invoices/clients")}
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
