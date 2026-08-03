import { useCallback, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { AxiosError } from "axios";
import { ConfirmDialog, InfoDialog } from "@/src/shared/ui";
import { useClientDetails } from "../hooks/useClientDetails";
import { useDeleteClient } from "../hooks/useDeleteClient";
import { useUpdateClient } from "../hooks/useUpdateClient";
import { ROUTES } from "@/src/shared/navigation/routes";
import type { UpdateClientError } from "../types/clientTypes";

export default function ClientDetailsScreen() {
  const { clientSlug } = useLocalSearchParams<{ clientSlug: string }>();
  const [limitErrorMessage, setLimitErrorMessage] = useState<string | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const clientDetails = useClientDetails(clientSlug);
  const deleteClient = useDeleteClient();
  const updateClient = useUpdateClient();

  useFocusEffect(
    useCallback(() => {
      clientDetails.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientSlug]),
  );

  const handleConfirmDelete = () => {
    deleteClient.mutate(clientSlug, {
      onSuccess: () => {
        router.replace(ROUTES.invoices.clients.list);
      },
    });
  };

  const handleArchive = () => {
    updateClient.mutate({ slug: clientSlug, payload: { is_archived: true } });
  };

  const handleUnarchive = () => {
    updateClient.mutate(
      { slug: clientSlug, payload: { is_archived: false } },
      {
        onError: (error) => {
          const axiosError = error as AxiosError<UpdateClientError>;
          const message = axiosError.response?.data?.is_archived?.[0];
          setLimitErrorMessage(
            message ?? "Could not unarchive this client. Please try again.",
          );
        },
      },
    );
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

  const isArchived = clientDetails.data?.is_archived ?? false;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{clientDetails.data?.name}</Text>
      <Text>{clientDetails.data?.email}</Text>
      <Text>{clientDetails.data?.phone}</Text>
      <Text>{clientDetails.data?.address}</Text>

      {!isArchived && (
        <Button
          title="Edit Client"
          onPress={() => router.push(ROUTES.invoices.clients.edit(clientSlug))}
        />
      )}

      {isArchived ? (
        <Button
          title="Unarchive Client"
          onPress={handleUnarchive}
          disabled={updateClient.isPending}
        />
      ) : (
        <Button
          title="Archive Client"
          onPress={handleArchive}
          disabled={updateClient.isPending}
        />
      )}

      <Button
        title="Delete Client"
        color="red"
        onPress={() => setShowDeleteConfirm(true)}
      />

      <Button title="Back" onPress={() => router.back()} />

      <ConfirmDialog
        visible={showDeleteConfirm}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        isConfirming={deleteClient.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <InfoDialog
        visible={limitErrorMessage !== null}
        title="Cannot Unarchive"
        message={limitErrorMessage ?? ""}
        onDismiss={() => setLimitErrorMessage(null)}
      />
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
