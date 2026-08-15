import { useState } from "react";
import { FlatList, Pressable, View } from "react-native";

import { Text, Input, Spinner, Modal } from "@/src/shared/ui";
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

  const clientResults = clients.data?.pages[0]?.results ?? [];

  function handleSelect(client: Client) {
    onSelect(client);
    setSearchText("");
    onDismiss();
  }

  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={onDismiss}
      title="Select Client"
    >
      <Input
        placeholder="Search by name, email or phone"
        value={searchText}
        onChangeText={setSearchText}
      />

      {clients.isLoading && (
        <View className="py-6 items-center">
          <Spinner />
        </View>
      )}

      {!clients.isLoading && clientResults.length === 0 && (
        <Text variant="body-sm" className="text-center py-3">
          No clients found.
        </Text>
      )}

      {clientResults.length > 0 && (
        <FlatList
          className="max-h-[400px] grow-0"
          data={clientResults}
          keyExtractor={(item) => item.slug}
          renderItem={({ item }) => (
            <Pressable
              className="py-3 border-b border-border"
              onPress={() => handleSelect(item)}
            >
              <Text variant="body-sm">{item.name}</Text>
              <Text variant="caption">{item.phone}</Text>
            </Pressable>
          )}
        />
      )}
    </Modal>
  );
}
