import { useState } from "react";
import { FlatList, Pressable, View } from "react-native";

import { Text, Input, Spinner, Modal, Avatar } from "@/src/shared/ui";
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
          ItemSeparatorComponent={() => <View className="h-2" />}
          // web:pr-2 keeps the browser's native scrollbar off the card
          // content — see Container.tsx's ScrollView for the full
          // explanation of why this is needed on web only.
          contentContainerClassName="web:pr-2 py-1"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSelect(item)}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              className="flex-row items-center gap-3 bg-card border border-border rounded-lg p-3"
            >
              <Avatar name={item.name} size={36} />

              <View className="flex-1 gap-0.5">
                <Text
                  variant="body-sm"
                  className="font-semibold"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text
                  variant="caption"
                  className="text-muted-foreground"
                  numberOfLines={1}
                >
                  {item.phone}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </Modal>
  );
}
