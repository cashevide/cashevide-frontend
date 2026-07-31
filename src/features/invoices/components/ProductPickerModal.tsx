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
    <Modal visible={visible} dismissible onDismiss={onDismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Product</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by title"
          value={searchText}
          onChangeText={setSearchText}
        />

        {products.isLoading && <ActivityIndicator />}

        {products.data && products.data.results.length === 0 && (
          <Text style={styles.emptyText}>No products found.</Text>
        )}

        {products.data && products.data.results.length > 0 && (
          <FlatList
            style={styles.list}
            data={products.data.results}
            keyExtractor={(item) => item.slug}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.rowName}>{item.title}</Text>
                <Text style={styles.rowMeta}>{item.unit_price}</Text>
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
