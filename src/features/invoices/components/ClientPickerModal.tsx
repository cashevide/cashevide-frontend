import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Modal } from "@/src/shared/ui";
import { useClients } from "@/src/features/clients/hooks/useClients";
import { useDebouncedValue } from "@/src/shared/hooks/useDebouncedValue";

import type { Client } from "@/src/features/clients/types/clientTypes";

type ClientPickerModalProps = {
  visible: boolean;
  onSelect: (client: Client) => void;
  onDismiss: () => void;
};

export default function ClientPickerModal({
  visible,
  onSelect,
  onDismiss,
}: ClientPickerModalProps) {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const clients = useClients({
    search: debouncedSearchText || undefined,
    ordering: "name",
  });

  function handleSelect(client: Client) {
    onSelect(client);
    setSearchText("");
    onDismiss();
  }

  return (
    <Modal visible={visible} dismissible onDismiss={onDismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Client</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email or phone"
          value={searchText}
          onChangeText={setSearchText}
        />

        {clients.isLoading && <ActivityIndicator />}

        {clients.data && clients.data.results.length === 0 && (
          <Text style={styles.emptyText}>No clients found.</Text>
        )}

        {clients.data && clients.data.results.length > 0 && (
          <FlatList
            style={styles.list}
            data={clients.data.results}
            keyExtractor={(item) => item.slug}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowMeta}>{item.phone}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    maxHeight: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    paddingVertical: 12,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  rowMeta: {
    color: "#666",
    fontSize: 13,
  },
});
