import { Button, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { useProductDetails } from "../hooks/useProductDetails";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { ROUTES } from "@/src/shared/navigation/routes";

export default function ProductDetailsScreen() {
  const { productSlug } = useLocalSearchParams<{ productSlug: string }>();

  const productDetails = useProductDetails(productSlug);
  const deleteProduct = useDeleteProduct();

  useFocusEffect(
    useCallback(() => {
      productDetails.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productSlug]),
  );

  const handleDelete = () => {
    deleteProduct.mutate(productSlug, {
      onSuccess: () => {
        router.replace(ROUTES.invoices.products.list);
      },
    });
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{productDetails.data?.title}</Text>
      <Text>{productDetails.data?.description}</Text>
      <Text>₹{productDetails.data?.unit_price}</Text>

      <Button
        title="Edit Product"
        onPress={() => router.push(ROUTES.invoices.products.edit(productSlug))}
      />

      <Button
        title="Delete Product"
        color="red"
        onPress={handleDelete}
        disabled={deleteProduct.isPending}
      />

      <Button title="Back" onPress={() => router.back()} />
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
