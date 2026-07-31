import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { DateField } from "@/src/shared/ui";

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
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>
          {payment.id ? `Payment #${payment.id}` : "New Payment"}
        </Text>
        <TouchableOpacity onPress={onRemove}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
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

      <TextInput
        style={styles.input}
        placeholder="Payment method (optional)"
        value={payment.payment_method ?? ""}
        onChangeText={(text) => onChange({ ...payment, payment_method: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Note (optional)"
        value={payment.note ?? ""}
        onChangeText={(text) => onChange({ ...payment, note: text })}
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    color: "#666",
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
});
