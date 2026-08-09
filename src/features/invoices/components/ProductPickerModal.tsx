import { useState } from "react";
import { FlatList, Pressable, View } from "react-native";

import { Text, Input, Spinner, Modal } from "@/src/shared/ui";
import { useProducts } from "@/src/features/products/hooks/useProducts";
import { useDebouncedValue } from "@/src/shared/hooks/useDebouncedValue";

import type { Product } from "@/src/features/products/types/productTypes";

type ProductPickerModalProps = {
  visible: boolean;
  onSelect: (product: Product) => void;
  onDismiss: () => void;
};

export default function ProductPickerModal({
  visible,
  onSelect,
  onDismiss,
}: ProductPickerModalProps) {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const products = useProducts({
    search: debouncedSearchText || undefined,
    ordering: "title",
  });

  function handleSelect(product: Product) {
    onSelect(product);
    setSearchText("");
    onDismiss();
  }

  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={onDismiss}
      title="Select Product"
    >
      <Input
        placeholder="Search by title"
        value={searchText}
        onChangeText={setSearchText}
      />

      {products.isLoading && (
        <View className="py-6 items-center">
          <Spinner />
        </View>
      )}

      {products.data && products.data.results.length === 0 && (
        <Text variant="body-sm" className="text-center py-3">
          No products found.
        </Text>
      )}

      {products.data && products.data.results.length > 0 && (
        <FlatList
          className="max-h-[400px] grow-0"
          data={products.data.results}
          keyExtractor={(item) => item.slug}
          renderItem={({ item }) => (
            <Pressable
              className="py-3 border-b border-border"
              onPress={() => handleSelect(item)}
            >
              <Text variant="body-sm">{item.title}</Text>
              <Text variant="caption">{item.unit_price}</Text>
            </Pressable>
          )}
        />
      )}
    </Modal>
  );
}
