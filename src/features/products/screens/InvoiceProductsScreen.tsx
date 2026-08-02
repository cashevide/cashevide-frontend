import { useState } from "react";
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
import { useCallback } from "react";
import { useProducts } from "../hooks/useProducts";
import { useProductUsage } from "../hooks/useProductUsage";
import { useDebouncedValue } from "@/src/shared/hooks/useDebouncedValue";
import { ROUTES } from "@/src/shared/navigation/routes";
import InvoiceSubTabs from "@/src/features/invoices/components/InvoiceSubTabs";
import type { GetProductsParams } from "../api/productsApi";

export default function InvoiceProductsScreen() {
  const [searchText, setSearchText] = useState("");
  const [ordering, setOrdering] =
    useState<GetProductsParams["ordering"]>("-created_at");

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const products = useProducts({
    search: debouncedSearchText || undefined,
    ordering,
  });
  const productUsage = useProductUsage();

  useFocusEffect(
    useCallback(() => {
      products.refetch();
      productUsage.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const isUsageLimitReached =
    productUsage.data?.max_allowed_product != null &&
    productUsage.data.current_product_count >=
      productUsage.data.max_allowed_product;

  return (
    <View style={styles.container}>
      <InvoiceSubTabs />

      <TextInput
        style={styles.searchInput}
        placeholder="Search by title"
        value={searchText}
        onChangeText={setSearchText}
      />

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
        <TouchableOpacity onPress={() => setOrdering("title")}>
          <Text
            style={
              ordering === "title"
                ? styles.orderingActive
                : styles.orderingInactive
            }
          >
            Title A-Z
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.archivedRow}
        onPress={() => router.push(ROUTES.invoices.products.archived)}
      >
        <Text style={styles.archivedRowText}>Archived Products</Text>
      </TouchableOpacity>

      {products.isLoading && <Text>Loading products...</Text>}

      {products.data && products.data.results.length === 0 && (
        <Text>No products yet — add your first product to get started.</Text>
      )}

      {products.data && products.data.results.length > 0 && (
        <FlatList
          style={styles.list}
          data={products.data.results}
          keyExtractor={(item) => item.slug}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productRow}
              onPress={() =>
                router.push(ROUTES.invoices.products.detail(item.slug))
              }
            >
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productMeta}>₹{item.unit_price}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {productUsage.data && (
        <Text style={styles.usageText}>
          {productUsage.data.current_product_count}
          {productUsage.data.max_allowed_product != null
            ? ` / ${productUsage.data.max_allowed_product}`
            : ""}{" "}
          products
        </Text>
      )}

      <Button
        title="+ Add Product"
        onPress={() => router.push(ROUTES.invoices.products.create)}
        disabled={isUsageLimitReached}
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
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
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
  archivedRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  archivedRowText: {
    fontSize: 14,
    color: "#3399ff",
  },
  list: {
    flex: 1,
  },
  productRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productMeta: {
    color: "#666",
  },
  usageText: {
    textAlign: "center",
    color: "#666",
  },
});
