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

  const productResults = products.data?.pages[0]?.results ?? [];

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

      {!products.isLoading && productResults.length === 0 && (
        <Text variant="body-sm" className="text-center py-3">
          No products found.
        </Text>
      )}

      {productResults.length > 0 && (
        <FlatList
          className="max-h-[400px] grow-0"
          data={productResults}
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
              className="gap-0.5 bg-card border border-border rounded-lg p-3"
            >
              <Text
                variant="body-sm"
                className="font-semibold"
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text
                variant="caption"
                className="text-muted-foreground"
                numberOfLines={1}
              >
                {item.unit_price}
              </Text>
            </Pressable>
          )}
        />
      )}
    </Modal>
  );
}
