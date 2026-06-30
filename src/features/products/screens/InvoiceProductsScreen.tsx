import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import InvoiceSubTabs from "@/src/features/invoices/components/InvoiceSubTabs";

export default function InvoiceProductsScreen() {
  return (
    <View style={styles.container}>
      <InvoiceSubTabs />
      <Text>Invoice Products Screen</Text>
      <Text>Search, filter and product list will come here later</Text>

      <Button
        title="Open Test Product"
        onPress={() =>
          router.push({
            pathname: "/invoices/products/[productSlug]",
            params: { productSlug: "test-product" },
          })
        }
      />

      <Button
        title="Add New Product"
        onPress={() => router.push("/invoices/products/create")}
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
  },
});
