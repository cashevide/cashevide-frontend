import { Pressable, View } from "react-native";
import { TrashIcon } from "react-native-heroicons/outline";

import { Text, Input, DateField } from "@/src/shared/ui";

import type { PaymentRecordRequest } from "../types/paymentTypes";

type InvoicePaymentFormRowProps = {
  payment: PaymentRecordRequest;
  onChange: (payment: PaymentRecordRequest) => void;
  onRemove: () => void;
};

export default function InvoicePaymentFormRow({
  payment,
  onChange,
  onRemove,
}: InvoicePaymentFormRowProps) {
  return (
    <View className="gap-3 rounded-lg border border-border bg-card p-4">
      <View className="flex-row items-center justify-between">
        <Text variant="body-sm" className="font-semibold text-muted-foreground">
          {payment.id ? `Payment #${payment.id}` : "New Payment"}
        </Text>
        <Pressable
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel="Remove payment"
          hitSlop={8}
        >
          <TrashIcon
            width={18}
            height={18}
            color="rgb(var(--color-destructive-text))"
          />
        </Pressable>
      </View>

      <Input
        placeholder="Amount"
        keyboardType="decimal-pad"
        value={payment.amount}
        onChangeText={(text) => onChange({ ...payment, amount: text })}
      />

      <DateField
        label="Payment Date"
        value={payment.payment_date || undefined}
        onChange={(value) =>
          onChange({ ...payment, payment_date: value ?? "" })
        }
        placeholder="Select date"
      />

      <Input
        placeholder="Payment method (optional)"
        value={payment.payment_method ?? ""}
        onChangeText={(text) => onChange({ ...payment, payment_method: text })}
      />

      <Input
        placeholder="Note (optional)"
        value={payment.note ?? ""}
        onChangeText={(text) => onChange({ ...payment, note: text })}
      />
    </View>
  );
}
