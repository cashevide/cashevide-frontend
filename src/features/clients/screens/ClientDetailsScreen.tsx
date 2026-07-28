import { useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useClientDetails } from "../hooks/useClientDetails";
import { useDeleteClient } from "../hooks/useDeleteClient";
import { ROUTES } from "@/src/shared/navigation/routes";

export default function ClientDetailsScreen() {
  const { clientSlug } = useLocalSearchParams<{ clientSlug: string }>();

  const clientDetails = useClientDetails(clientSlug);
  const deleteClient = useDeleteClient();

  useFocusEffect(
    useCallback(() => {
      clientDetails.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientSlug]),
  );

  const handleDelete = () => {
    deleteClient.mutate(clientSlug, {
      onSuccess: () => {
        router.replace(ROUTES.invoices.clients.list);
      },
    });
  };

  if (clientDetails.isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading client...</Text>
      </View>
    );
  }

  if (clientDetails.isError) {
    return (
      <View style={styles.container}>
        <Text>Client not found.</Text>
        <Button
          title="Back to Clients"
          onPress={() => router.replace(ROUTES.invoices.clients.list)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{clientDetails.data?.name}</Text>
      <Text>{clientDetails.data?.email}</Text>
      <Text>{clientDetails.data?.phone}</Text>
      <Text>{clientDetails.data?.address}</Text>

      <Button
        title="Edit Client"
        onPress={() => router.push(ROUTES.invoices.clients.edit(clientSlug))}
      />

      <Button
        title="Delete Client"
        color="red"
        onPress={handleDelete}
        disabled={deleteClient.isPending}
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
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
