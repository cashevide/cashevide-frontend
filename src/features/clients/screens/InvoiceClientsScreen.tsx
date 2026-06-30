import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import InvoiceSubTabs from "@/src/features/invoices/components/InvoiceSubTabs";

export default function InvoiceClientsScreen() {
  return (
    <View style={styles.container}>
      <InvoiceSubTabs />
      <Text>Invoice Clients Screen</Text>
      <Text>Search, filter and client list will come here later</Text>

      <Button
        title="Open Test Client"
        onPress={() =>
          router.push({
            pathname: "/invoices/clients/[clientSlug]",
            params: { clientSlug: "test-client" },
          })
        }
      />

      <Button
        title="Add New Client"
        onPress={() => router.push("/invoices/clients/create")}
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
