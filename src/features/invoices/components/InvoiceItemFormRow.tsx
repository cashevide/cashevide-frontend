import { useState } from "react";
import { Pressable, View } from "react-native";
import { TrashIcon } from "react-native-heroicons/outline";

import { Text, Input, SegmentedTabs } from "@/src/shared/ui";
import ProductPickerModal from "./ProductPickerModal";

import type { Product } from "@/src/features/products/types/productTypes";
import type { InvoiceItemRequest } from "../types/invoiceItemTypes";

const UNIT_TYPE_OPTIONS: {
  label: string;
  value: NonNullable<InvoiceItemRequest["unit_type"]>;
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

  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unit_price) || 0;
  const lineTotal = quantity * unitPrice;
  const hasLineTotal = quantity > 0 && unitPrice > 0;

  return (
    <View className="gap-3 border-b border-border pb-5">
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

      <View className="flex-row items-center gap-3">
        <SegmentedTabs
          items={UNIT_TYPE_OPTIONS.map((option) => ({
            key: option.value,
            label: option.label,
          }))}
          activeKey={item.unit_type ?? null}
          onSelect={(key) =>
            onChange({
              ...item,
              unit_type: key as InvoiceItemRequest["unit_type"],
            })
          }
          // Matches Input's h-12 (48px): track padding (p-2.5, 10px
          // each side) + the h-7 segment (28px) = 48px, so this row
          // doesn't have a visibly shorter control next to the
          // quantity input.
          className="p-2.5"
        />

        <View className="w-20">
          <Input
            placeholder="Qty"
            keyboardType="decimal-pad"
            value={item.quantity ?? ""}
            onChangeText={(text) => onChange({ ...item, quantity: text })}
          />
        </View>
      </View>

      <Input
        placeholder="Unit price"
        keyboardType="decimal-pad"
        value={item.unit_price ?? ""}
        onChangeText={(text) => onChange({ ...item, unit_price: text })}
      />

      {/* Line total — qty × unit price, computed here so the person
          doesn't have to do that math themselves while entering an
          item, especially on mobile where there's no live preview
          to cross-check against. */}
      {hasLineTotal && (
        <View className="flex-row justify-end">
          <Text variant="body-sm" className="text-muted-foreground">
            Line total:{" "}
            <Text variant="body-sm" className="font-semibold text-foreground">
              {lineTotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </Text>
        </View>
      )}

      <ProductPickerModal
        visible={productPickerVisible}
        onSelect={handleProductSelect}
        onDismiss={() => setProductPickerVisible(false)}
      />
    </View>
  );
}
