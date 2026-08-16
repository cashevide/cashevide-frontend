import { useState } from "react";
import { Pressable, View } from "react-native";
import { TrashIcon } from "react-native-heroicons/outline";

import { cn } from "@/src/shared/utils/cn";
import { Text, Input } from "@/src/shared/ui";
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
  // Hides the remove button when this is the only item left — an
  // invoice needs at least one item, so removing the last row would
  // leave the form in an unsubmittable state with no way back in.
  canRemove: boolean;
};

export default function InvoiceItemFormRow({
  item,
  onChange,
  onRemove,
  canRemove,
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
    <View className="gap-3 rounded-lg border border-border bg-card p-4">
      <View className="flex-row items-center justify-between gap-3">
        <Pressable onPress={() => setProductPickerVisible(true)}>
          <Text variant="body-sm" className="text-link">
            {item.product ? "Product selected — change" : "Select from catalog"}
          </Text>
        </Pressable>

        <View className="flex-row items-center gap-3">
          {item.product != null && (
            <Pressable onPress={handleClearProduct}>
              <Text variant="body-sm" className="text-muted-foreground">
                Clear
              </Text>
            </Pressable>
          )}

          {canRemove && (
            <Pressable
              onPress={onRemove}
              accessibilityRole="button"
              accessibilityLabel="Remove item"
              hitSlop={8}
            >
              <TrashIcon
                width={18}
                height={18}
                color="rgb(var(--color-destructive-text))"
              />
            </Pressable>
          )}
        </View>
      </View>

      <Input
        placeholder="Item title"
        value={item.title ?? ""}
        onChangeText={(text) => onChange({ ...item, title: text })}
      />

      <Input
        placeholder="Description (optional)"
        value={item.description ?? ""}
        onChangeText={(text) => onChange({ ...item, description: text })}
      />

      <View className="flex-row items-end gap-3">
        <View className="w-20">
          <Input
            placeholder="Qty"
            keyboardType="decimal-pad"
            value={item.quantity ?? ""}
            onChangeText={(text) => onChange({ ...item, quantity: text })}
          />
        </View>

        <View className="flex-1 flex-row gap-2">
          {UNIT_TYPE_OPTIONS.map((option) => {
            const isActive = item.unit_type === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => onChange({ ...item, unit_type: option.value })}
                className={cn(
                  "h-12 flex-1 items-center justify-center rounded-lg border",
                  isActive
                    ? "bg-primary border-primary"
                    : "bg-card border-border",
                )}
              >
                <Text
                  variant="body-sm"
                  className={
                    isActive ? "text-primary-foreground" : "text-foreground"
                  }
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Input
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
