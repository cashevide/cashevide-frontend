import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useProductDetails } from "../hooks/useProductDetails";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { ROUTES } from "@/src/shared/navigation/routes";

export default function ProductFormScreen() {
  const { productSlug } = useLocalSearchParams<{ productSlug?: string }>();
  const isEditMode = Boolean(productSlug);

  const productDetails = useProductDetails(productSlug ?? "");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  useEffect(() => {
    if (isEditMode && productDetails.data) {
      setTitle(productDetails.data.title);
      setDescription(productDetails.data.description);
      setUnitPrice(productDetails.data.unit_price);
    }
  }, [isEditMode, productDetails.data]);

  const mutation = isEditMode ? updateProduct : createProduct;

  const handleSave = () => {
    if (isEditMode && productSlug) {
      updateProduct.mutate(
        {
          slug: productSlug,
          payload: { title, description, unit_price: unitPrice },
        },
        {
          onSuccess: (data) => {
            // Always use the fresh slug from the response — the backend
            // regenerates the product slug on every save(), even if the
            // title didn't change, so the old param slug may now be stale.
            router.replace(ROUTES.invoices.products.detail(data.slug));
          },
        },
      );
      return;
    }

    createProduct.mutate(
      { title, description, unit_price: unitPrice },
      {
        onSuccess: (data) => {
          router.replace(ROUTES.invoices.products.detail(data.slug));
        },
      },
    );
  };

  if (isEditMode && productDetails.isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading product...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{isEditMode ? "Edit Product" : "Add Product"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Unit Price"
        value={unitPrice}
        onChangeText={setUnitPrice}
        keyboardType="decimal-pad"
      />

      <Button
        title={isEditMode ? "Save Changes" : "Create Product"}
        onPress={handleSave}
        disabled={mutation.isPending || !title || !unitPrice}
      />

      {mutation.isError && (
        <Text style={styles.error}>
          {JSON.stringify(
            (mutation.error as any)?.response?.data ?? mutation.error.message,
          )}
        </Text>
      )}

      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});
