import { router, useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ProductFormScreen() {
  const { productSlug } = useLocalSearchParams<{ productSlug?: string }>();

  const isEditMode = Boolean(productSlug);

  function handleSaveTest() {
    const nextProductSlug = productSlug ?? "test-product";

    router.replace({
      pathname: "/invoices/products/[productSlug]",
      params: { productSlug: nextProductSlug },
    });
  }

  return (
    <View style={styles.container}>
      <Text>
        {isEditMode ? "Edit Product Screen" : "Create Product Screen"}
      </Text>

      {isEditMode ? (
        <Text>Editing Product Slug: {productSlug}</Text>
      ) : (
        <Text>New product form will come here later</Text>
      )}

      <Text>Title, description and unit price fields will come here later</Text>

      <Button
        title={isEditMode ? "Save Product Changes Test" : "Create Product Test"}
        onPress={handleSaveTest}
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
  },
});
