import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import InvoiceSubTabs from "../components/InvoiceSubTabs";

export default function InvoiceDashboardScreen() {
  return (
    <View style={styles.container}>
      <InvoiceSubTabs />

      <Text>Invoice Dashboard Screen</Text>
      <Text>
        Revenue, outstanding balance and recent invoices will come here later
      </Text>

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
