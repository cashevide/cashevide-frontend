import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ProductPickerModal from "./ProductPickerModal";

import type { Product } from "@/src/features/products/types/productTypes";
import type { InvoiceItemRequest } from "../types/invoiceItemTypes";

const UNIT_TYPE_OPTIONS: {
  label: string;
  value: InvoiceItemRequest["unit_type"];
}[] = [
  { label: "Qty", value: "QTY" },
  { label: "Hrs", value: "HRS" },
  { label: "Days", value: "DAYS" },
];

type InvoiceItemFormRowProps = {
  item: InvoiceItemRequest;
  onChange: (item: InvoiceItemRequest) => void;
  onRemove: () => void;
};

export default function InvoiceItemFormRow({
  item,
  onChange,
  onRemove,
}: InvoiceItemFormRowProps) {
  const [productPickerVisible, setProductPickerVisible] = useState(false);

  function handleProductSelect(product: Product) {
    onChange({
      ...item,
      product: product.id,
      title: item.title || product.title,
      description: item.description || product.description,
      unit_price: item.unit_price || product.unit_price,
    });
  }

  function handleClearProduct() {
    onChange({ ...item, product: null });
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.productButton}
          onPress={() => setProductPickerVisible(true)}
        >
          <Text style={styles.productButtonText}>
            {item.product ? "Product selected — change" : "Select from catalog"}
          </Text>
        </TouchableOpacity>

        {item.product != null && (
          <TouchableOpacity onPress={handleClearProduct}>
            <Text style={styles.clearProductText}>Clear</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onRemove}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Item title"
        value={item.title ?? ""}
        onChangeText={(text) => onChange({ ...item, title: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        value={item.description ?? ""}
        onChangeText={(text) => onChange({ ...item, description: text })}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Qty"
          keyboardType="decimal-pad"
          value={item.quantity ?? ""}
          onChangeText={(text) => onChange({ ...item, quantity: text })}
        />

        <View style={styles.unitTypeRow}>
          {UNIT_TYPE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.unitTypePill,
                item.unit_type === option.value && styles.unitTypePillActive,
              ]}
              onPress={() => onChange({ ...item, unit_type: option.value })}
            >
              <Text
                style={
                  item.unit_type === option.value
                    ? styles.unitTypeTextActive
                    : styles.unitTypeText
                }
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Unit price"
        keyboardType="decimal-pad"
        value={item.unit_price ?? ""}
        onChangeText={(text) => onChange({ ...item, unit_price: text })}
      />

      <ProductPickerModal
        visible={productPickerVisible}
        onSelect={handleProductSelect}
        onDismiss={() => setProductPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  productButton: {
    flex: 1,
  },
  productButtonText: {
    color: "#3399ff",
    fontWeight: "bold",
  },
  clearProductText: {
    color: "#999",
  },
  removeText: {
    color: "#e53935",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  smallInput: {
    flex: 1,
  },
  unitTypeRow: {
    flexDirection: "row",
    gap: 6,
  },
  unitTypePill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  unitTypePillActive: {
    backgroundColor: "#3399ff",
    borderColor: "#3399ff",
  },
  unitTypeText: {
    color: "#333",
    fontSize: 12,
  },
  unitTypeTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
