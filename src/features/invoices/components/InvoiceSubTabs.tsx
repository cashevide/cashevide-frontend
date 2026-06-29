import { router } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

export default function InvoiceSubTabs() {
  return (
    <View style={styles.container}>
      <Button title="Dashboard" onPress={() => router.push("/invoices")} />

      <Button
        title="Invoices"
        onPress={() => router.push("/invoices/invoices")}
      />

      <Button
        title="Clients"
        onPress={() => router.push("/invoices/clients")}
      />

      <Button
        title="Products"
        onPress={() => router.push("/invoices/products")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
});
