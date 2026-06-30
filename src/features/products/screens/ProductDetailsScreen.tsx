import { router, useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ProductDetailsScreen() {
  const { productSlug } = useLocalSearchParams<{ productSlug: string }>();

  return (
    <View style={styles.container}>
      <Text>Product Details Screen</Text>
      <Text>Product Slug: {productSlug}</Text>
      <Text>
        Product title, description and unit price will come here later
      </Text>

      <Button
        title="Edit Product"
        onPress={() =>
          router.push({
            pathname: "/invoices/products/[productSlug]/edit",
            params: { productSlug },
          })
        }
      />

      <Button
        title="Delete Product Test"
        onPress={() => router.replace("/invoices/products")}
      />

      <Button
        title="Back to Products"
        onPress={() => router.push("/invoices/products")}
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
