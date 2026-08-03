import { useCallback, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { AxiosError } from "axios";
import { InfoDialog } from "@/src/shared/ui";
import { useClients } from "../hooks/useClients";
import { useUpdateClient } from "../hooks/useUpdateClient";
import { useDebouncedValue } from "@/src/shared/hooks/useDebouncedValue";
import { ROUTES } from "@/src/shared/navigation/routes";
import InvoiceSubTabs from "@/src/features/invoices/components/InvoiceSubTabs";
import type { GetClientsParams } from "../api/clientsApi";
import type { UpdateClientError } from "../types/clientTypes";

export default function ArchivedClientsScreen() {
  const [searchText, setSearchText] = useState("");
  const [ordering, setOrdering] =
    useState<GetClientsParams["ordering"]>("-created_at");
  const [limitErrorMessage, setLimitErrorMessage] = useState<string | null>(
    null,
  );

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const archivedClients = useClients({
    search: debouncedSearchText || undefined,
    ordering,
    is_archived: true,
  });

  const updateClient = useUpdateClient();

  useFocusEffect(
    useCallback(() => {
      archivedClients.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  function handleUnarchive(slug: string) {
    updateClient.mutate(
      { slug, payload: { is_archived: false } },
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
  }

  return (
    <View style={styles.container}>
      <InvoiceSubTabs />

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, email or phone"
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.orderingRow}>
        <TouchableOpacity onPress={() => setOrdering("-created_at")}>
          <Text
            style={
              ordering === "-created_at"
                ? styles.orderingActive
                : styles.orderingInactive
            }
          >
            Newest
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOrdering("name")}>
          <Text
            style={
              ordering === "name"
                ? styles.orderingActive
                : styles.orderingInactive
            }
          >
            Name A-Z
          </Text>
        </TouchableOpacity>
      </View>

      {archivedClients.isLoading && <Text>Loading archived clients...</Text>}

      {archivedClients.data && archivedClients.data.results.length === 0 && (
        <Text>No archived clients.</Text>
      )}

      {archivedClients.data && archivedClients.data.results.length > 0 && (
        <FlatList
          style={styles.list}
          data={archivedClients.data.results}
          keyExtractor={(item) => item.slug}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.clientRow}
              onPress={() =>
                router.push(ROUTES.invoices.clients.detail(item.slug))
              }
            >
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{item.name}</Text>
                <Text style={styles.clientMeta}>{item.phone}</Text>
              </View>

              <Button
                title="Unarchive"
                onPress={() => handleUnarchive(item.slug)}
                disabled={
                  updateClient.isPending &&
                  updateClient.variables?.slug === item.slug
                }
              />
            </TouchableOpacity>
          )}
        />
      )}

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
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
  orderingRow: {
    flexDirection: "row",
    gap: 16,
  },
  orderingActive: {
    fontWeight: "bold",
    color: "#3399ff",
  },
  orderingInactive: {
    color: "#666",
  },
  list: {
    flex: 1,
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  clientMeta: {
    color: "#666",
  },
});
