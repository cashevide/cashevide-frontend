import { useCallback, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";

import { useInvoices } from "../hooks/useInvoices";
import { useDebouncedValue } from "@/src/shared/hooks/useDebouncedValue";
import { ROUTES } from "@/src/shared/navigation/routes";
import InvoiceSubTabs from "../components/InvoiceSubTabs";
import InvoiceStatusBadge from "../components/InvoiceStatusBadge";
import InvoiceFilterModal from "../components/InvoiceFilterModal";

import type { InvoiceFilters } from "../components/InvoiceFilterModal";
import type { GetInvoicesParams } from "../api/invoicesApi";
import type { Invoice } from "../types/invoiceTypes";

const EMPTY_FILTERS: InvoiceFilters = {
  status: undefined,
  currency: undefined,
  from_issue_date: undefined,
  to_issue_date: undefined,
  from_due_date: undefined,
  to_due_date: undefined,
};

function formatAmount(amount: string, currency: string): string {
  return `${currency || ""} ${amount}`.trim();
}

function isFiltersActive(filters: InvoiceFilters): boolean {
  return Object.values(filters).some((value) => value !== undefined);
}

export default function InvoiceListScreen() {
  const [searchText, setSearchText] = useState("");
  const [ordering, setOrdering] =
    useState<GetInvoicesParams["ordering"]>("-created_at");
  const [filters, setFilters] = useState<InvoiceFilters>(EMPTY_FILTERS);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const invoices = useInvoices({
    search: debouncedSearchText || undefined,
    ordering,
    ...filters,
  });

  useFocusEffect(
    useCallback(() => {
      invoices.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const filtersActive = isFiltersActive(filters);

  function renderInvoiceRow({ item }: { item: Invoice }) {
    return (
      <TouchableOpacity
        style={styles.invoiceRow}
        onPress={() => router.push(ROUTES.invoices.detail(item.id))}
      >
        <View style={styles.rowLine}>
          <Text style={styles.invoiceNumber}>{item.invoice_number}</Text>
          <InvoiceStatusBadge status={item.status} />
        </View>

        <View style={styles.rowLine}>
          <Text style={styles.clientName}>
            {item.name || "Untitled Client"}
          </Text>
          <Text style={styles.amount}>
            {formatAmount(item.total_amount, item.currency)}
          </Text>
        </View>

        {item.due_date && (
          <Text style={styles.dueDate}>Due {item.due_date}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <InvoiceSubTabs />

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by invoice #, name, email or phone"
          value={searchText}
          onChangeText={setSearchText}
        />

        <TouchableOpacity
          style={[
            styles.filterButton,
            filtersActive && styles.filterButtonActive,
          ]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text
            style={
              filtersActive
                ? styles.filterButtonTextActive
                : styles.filterButtonText
            }
          >
            Filter
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.orderingRow}>
        <TouchableOpacity onPress={() => setOrdering("-created_at")}>
          <Text
            style={
              ordering === "-created_at"
                ? styles.orderingActive
                : styles.orderingInactive
            }
          >
            Newest
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOrdering("-due_date")}>
          <Text
            style={
              ordering === "-due_date"
                ? styles.orderingActive
                : styles.orderingInactive
            }
          >
            Due Date
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOrdering("-total_amount")}>
          <Text
            style={
              ordering === "-total_amount"
                ? styles.orderingActive
                : styles.orderingInactive
            }
          >
            Amount
          </Text>
        </TouchableOpacity>
      </View>

      {invoices.isLoading && <Text>Loading invoices...</Text>}

      {invoices.data && invoices.data.results.length === 0 && (
        <Text>No invoices yet — create your first invoice to get started.</Text>
      )}

      {invoices.data && invoices.data.results.length > 0 && (
        <FlatList
          style={styles.list}
          data={invoices.data.results}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderInvoiceRow}
        />
      )}

      <Button
        title="+ New Invoice"
        onPress={() => router.push(ROUTES.invoices.create)}
      />

      <InvoiceFilterModal
        visible={filterModalVisible}
        initialFilters={filters}
        onApply={setFilters}
        onDismiss={() => setFilterModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 16,
  },
  searchRow: {
    flexDirection: "row",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: "#3399ff",
    borderColor: "#3399ff",
  },
  filterButtonText: {
    color: "#333",
  },
  filterButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  orderingRow: {
    flexDirection: "row",
    gap: 16,
  },
  orderingActive: {
    fontWeight: "bold",
    color: "#3399ff",
  },
  orderingInactive: {
    color: "#666",
  },
  list: {
    flex: 1,
  },
  invoiceRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    gap: 4,
  },
  rowLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  clientName: {
    color: "#333",
  },
  amount: {
    fontWeight: "bold",
  },
  dueDate: {
    fontSize: 12,
    color: "#666",
  },
});
