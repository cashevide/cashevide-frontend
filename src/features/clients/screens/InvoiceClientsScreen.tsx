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
import { InfoDialog } from "@/src/shared/ui";
import { useClients } from "../hooks/useClients";
import { useClientUsage } from "../hooks/useClientUsage";
import { useDebouncedValue } from "@/src/shared/hooks/useDebouncedValue";
import { ROUTES } from "@/src/shared/navigation/routes";
import InvoiceSubTabs from "@/src/features/invoices/components/InvoiceSubTabs";
import type { GetClientsParams } from "../api/clientsApi";

export default function InvoiceClientsScreen() {
  const [searchText, setSearchText] = useState("");
  const [ordering, setOrdering] =
    useState<GetClientsParams["ordering"]>("-created_at");
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const clients = useClients({
    search: debouncedSearchText || undefined,
    ordering,
  });
  const clientUsage = useClientUsage();

  useFocusEffect(
    useCallback(() => {
      clients.refetch();
      clientUsage.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const isUsageLimitReached =
    clientUsage.data?.max_allowed_client != null &&
    clientUsage.data.current_client_count >=
      clientUsage.data.max_allowed_client;

  const handleAddClientPress = () => {
    if (isUsageLimitReached) {
      setShowLimitDialog(true);
      return;
    }
    router.push(ROUTES.invoices.clients.create);
  };

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

      <TouchableOpacity
        style={styles.archivedRow}
        onPress={() => router.push(ROUTES.invoices.clients.archived)}
      >
        <Text style={styles.archivedRowText}>Archived Clients</Text>
      </TouchableOpacity>

      {clients.isLoading && <Text>Loading clients...</Text>}

      {clients.data && clients.data.results.length === 0 && (
        <Text>No clients yet — add your first client to get started.</Text>
      )}

      {clients.data && clients.data.results.length > 0 && (
        <FlatList
          style={styles.list}
          data={clients.data.results}
          keyExtractor={(item) => item.slug}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.clientRow}
              onPress={() =>
                router.push(ROUTES.invoices.clients.detail(item.slug))
              }
            >
              <Text style={styles.clientName}>{item.name}</Text>
              <Text style={styles.clientMeta}>{item.phone}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {clientUsage.data && (
        <Text style={styles.usageText}>
          {clientUsage.data.current_client_count}
          {clientUsage.data.max_allowed_client != null
            ? ` / ${clientUsage.data.max_allowed_client}`
            : ""}{" "}
          clients
        </Text>
      )}

      <Button title="+ Add Client" onPress={handleAddClientPress} />

      <InfoDialog
        visible={showLimitDialog}
        title="Client Limit Reached"
        message={`You cannot add more than ${clientUsage.data?.max_allowed_client} clients in your current plan.`}
        onDismiss={() => setShowLimitDialog(false)}
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
  archivedRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  archivedRowText: {
    fontSize: 14,
    color: "#3399ff",
  },
  list: {
    flex: 1,
  },
  clientRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  clientMeta: {
    color: "#666",
  },
  usageText: {
    textAlign: "center",
    color: "#666",
  },
});
