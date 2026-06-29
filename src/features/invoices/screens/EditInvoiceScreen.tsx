import { router, useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import InvoiceSubTabs from "../components/InvoiceSubTabs";

export default function EditInvoiceScreen() {
  const { invoiceId, section } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>Edit Invoice Screen</Text>
      <Text>Invoice ID: {invoiceId}</Text>
      <Text>Section: {section ?? "default"}</Text>
      <Text>
        Edit client, items, dates, discount and payments will come here later
      </Text>

      <Button
        title="Save Changes Test"
        onPress={() => router.replace(`/invoices/${invoiceId}`)}
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
