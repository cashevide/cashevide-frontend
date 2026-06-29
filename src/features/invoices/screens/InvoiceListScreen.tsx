import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import InvoiceSubTabs from "../components/InvoiceSubTabs";

export default function InvoiceListScreen() {
  return (
    <View style={styles.container}>
      <InvoiceSubTabs />

      <Text>Invoice List Screen</Text>
      <Text>Search, filter and invoice list will come here later</Text>

      <Button
        title="Open Test Invoice"
        onPress={() => router.push("/invoices/1")}
      />

      <Button
        title="New Invoice"
        onPress={() => router.push("/invoices/create")}
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
