import { router, useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import InvoiceSubTabs from "../components/InvoiceSubTabs";

export default function InvoiceDetailsScreen() {
  const { invoiceId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>Invoice Details Screen</Text>
      <Text>Invoice ID: {invoiceId}</Text>
      <Text>
        Invoice preview, payment records and action buttons will come here later
      </Text>

      <Button
        title="Edit Invoice"
        onPress={() => router.push(`/invoices/${invoiceId}/edit`)}
      />

      <Button
        title="Record Payment Test"
        onPress={() =>
          router.push(`/invoices/${invoiceId}/edit?section=payments`)
        }
      />

      <Button title="Download PDF Test" onPress={() => {}} />

      <Button title="Share Test" onPress={() => {}} />

      <Button
        title="Delete Invoice Test"
        onPress={() => router.replace("/invoices/invoices")}
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
