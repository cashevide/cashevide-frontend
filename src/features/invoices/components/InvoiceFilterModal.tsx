import { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { DateField, Modal } from "@/src/shared/ui";

import type { GetInvoicesParams } from "../api/invoicesApi";
import type { InvoiceStatus } from "../types/invoiceTypes";

const STATUS_OPTIONS: { label: string; value: InvoiceStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Draft", value: "DRAFT" },
  { label: "Unpaid", value: "UNPAID" },
  { label: "Partially Paid", value: "PARTIALLY_PAID" },
  { label: "Paid", value: "PAID" },
];

type InvoiceFilterKeys =
  | "status"
  | "currency"
  | "from_issue_date"
  | "to_issue_date"
  | "from_due_date"
  | "to_due_date";

export type InvoiceFilters = Pick<GetInvoicesParams, InvoiceFilterKeys>;

const EMPTY_FILTERS: InvoiceFilters = {
  status: undefined,
  currency: undefined,
  from_issue_date: undefined,
  to_issue_date: undefined,
  from_due_date: undefined,
  to_due_date: undefined,
};

type InvoiceFilterModalProps = {
  visible: boolean;
  initialFilters: InvoiceFilters;
  onApply: (filters: InvoiceFilters) => void;
  onDismiss: () => void;
};

export default function InvoiceFilterModal({
  visible,
  initialFilters,
  onApply,
  onDismiss,
}: InvoiceFilterModalProps) {
  const [filters, setFilters] = useState<InvoiceFilters>(initialFilters);

  useEffect(() => {
    if (visible) {
      setFilters(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function handleApply() {
    onApply(filters);
    onDismiss();
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS);
  }

  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={onDismiss}
      footer={
        <View style={styles.footerRow}>
          <Button title="Clear" onPress={handleClear} />
          <Button title="Apply" onPress={handleApply} />
        </View>
      }
    >
      <Text style={styles.sectionTitle}>Status</Text>
      <View style={styles.statusRow}>
        {STATUS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.label}
            style={[
              styles.statusPill,
              filters.status === option.value && styles.statusPillActive,
            ]}
            onPress={() =>
              setFilters((prev) => ({ ...prev, status: option.value }))
            }
          >
            <Text
              style={
                filters.status === option.value
                  ? styles.statusPillTextActive
                  : styles.statusPillText
              }
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Currency</Text>
      <TextInput
        style={styles.currencyInput}
        placeholder="e.g. INR, USD"
        autoCapitalize="characters"
        maxLength={3}
        value={filters.currency ?? ""}
        onChangeText={(text) =>
          setFilters((prev) => ({
            ...prev,
            currency: text ? text.toUpperCase() : undefined,
          }))
        }
      />

      <Text style={styles.sectionTitle}>Issue Date</Text>
      <View style={styles.dateRangeRow}>
        <DateField
          label="From"
          value={filters.from_issue_date}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, from_issue_date: value }))
          }
        />
        <DateField
          label="To"
          value={filters.to_issue_date}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, to_issue_date: value }))
          }
        />
      </View>

      <Text style={styles.sectionTitle}>Due Date</Text>
      <View style={styles.dateRangeRow}>
        <DateField
          label="From"
          value={filters.from_due_date}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, from_due_date: value }))
          }
        />
        <DateField
          label="To"
          value={filters.to_due_date}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, to_due_date: value }))
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  statusPillActive: {
    backgroundColor: "#3399ff",
    borderColor: "#3399ff",
  },
  statusPillText: {
    color: "#333",
  },
  statusPillTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  currencyInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
  },
  dateRangeRow: {
    flexDirection: "row",
    gap: 12,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});
