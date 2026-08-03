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
import { AxiosError } from "axios";
import { InfoDialog } from "@/src/shared/ui";
import { useProducts } from "../hooks/useProducts";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useDebouncedValue } from "@/src/shared/hooks/useDebouncedValue";
import { ROUTES } from "@/src/shared/navigation/routes";
import InvoiceSubTabs from "@/src/features/invoices/components/InvoiceSubTabs";
import type { GetProductsParams } from "../api/productsApi";
import type { UpdateProductError } from "../types/productTypes";

export default function ArchivedProductsScreen() {
  const [searchText, setSearchText] = useState("");
  const [ordering, setOrdering] =
    useState<GetProductsParams["ordering"]>("-created_at");
  const [limitErrorMessage, setLimitErrorMessage] = useState<string | null>(
    null,
  );

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const archivedProducts = useProducts({
    search: debouncedSearchText || undefined,
    ordering,
    is_archived: true,
  });

  const updateProduct = useUpdateProduct();

  useFocusEffect(
    useCallback(() => {
      archivedProducts.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  function handleUnarchive(slug: string) {
    updateProduct.mutate(
      { slug, payload: { is_archived: false } },
      {
        onError: (error) => {
          const axiosError = error as AxiosError<UpdateProductError>;
          const message = axiosError.response?.data?.is_archived?.[0];
          setLimitErrorMessage(
            message ?? "Could not unarchive this product. Please try again.",
          );
        },
      },
    );
  }

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

      {archivedProducts.isLoading && <Text>Loading archived products...</Text>}

      {archivedProducts.data && archivedProducts.data.results.length === 0 && (
        <Text>No archived products.</Text>
      )}

      {archivedProducts.data && archivedProducts.data.results.length > 0 && (
        <FlatList
          style={styles.list}
          data={archivedProducts.data.results}
          keyExtractor={(item) => item.slug}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productRow}
              onPress={() =>
                router.push(ROUTES.invoices.products.detail(item.slug))
              }
            >
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{item.title}</Text>
                <Text style={styles.productMeta}>₹{item.unit_price}</Text>
              </View>

              <Button
                title="Unarchive"
                onPress={() => handleUnarchive(item.slug)}
                disabled={
                  updateProduct.isPending &&
                  updateProduct.variables?.slug === item.slug
                }
              />
            </TouchableOpacity>
          )}
        />
      )}

      <InfoDialog
        visible={limitErrorMessage !== null}
        title="Cannot Unarchive"
        message={limitErrorMessage ?? ""}
        onDismiss={() => setLimitErrorMessage(null)}
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
  list: {
    flex: 1,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productMeta: {
    color: "#666",
  },
});
