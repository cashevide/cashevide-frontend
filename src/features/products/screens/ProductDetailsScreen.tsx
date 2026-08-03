import { useCallback, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { AxiosError } from "axios";
import { ConfirmDialog, InfoDialog } from "@/src/shared/ui";
import { useProductDetails } from "../hooks/useProductDetails";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { ROUTES } from "@/src/shared/navigation/routes";
import type { UpdateProductError } from "../types/productTypes";

export default function ProductDetailsScreen() {
  const { productSlug } = useLocalSearchParams<{ productSlug: string }>();
  const [limitErrorMessage, setLimitErrorMessage] = useState<string | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const productDetails = useProductDetails(productSlug);
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  useFocusEffect(
    useCallback(() => {
      productDetails.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productSlug]),
  );

  const handleConfirmDelete = () => {
    deleteProduct.mutate(productSlug, {
      onSuccess: () => {
        router.replace(ROUTES.invoices.products.list);
      },
    });
  };

  const handleArchive = () => {
    updateProduct.mutate({
      slug: productSlug,
      payload: { is_archived: true },
    });
  };

  const handleUnarchive = () => {
    updateProduct.mutate(
      { slug: productSlug, payload: { is_archived: false } },
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
  };

  if (productDetails.isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading product...</Text>
      </View>
    );
  }

  if (productDetails.isError) {
    return (
      <View style={styles.container}>
        <Text>Product not found.</Text>
        <Button
          title="Back to Products"
          onPress={() => router.replace(ROUTES.invoices.products.list)}
        />
      </View>
    );
  }

  const isArchived = productDetails.data?.is_archived ?? false;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{productDetails.data?.title}</Text>
      <Text>{productDetails.data?.description}</Text>
      <Text>₹{productDetails.data?.unit_price}</Text>

      {!isArchived && (
        <Button
          title="Edit Product"
          onPress={() =>
            router.push(ROUTES.invoices.products.edit(productSlug))
          }
        />
      )}

      {isArchived ? (
        <Button
          title="Unarchive Product"
          onPress={handleUnarchive}
          disabled={updateProduct.isPending}
        />
      ) : (
        <Button
          title="Archive Product"
          onPress={handleArchive}
          disabled={updateProduct.isPending}
        />
      )}

      <Button
        title="Delete Product"
        color="red"
        onPress={() => setShowDeleteConfirm(true)}
      />

      <Button title="Back" onPress={() => router.back()} />

      <ConfirmDialog
        visible={showDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        isConfirming={deleteProduct.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

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
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
