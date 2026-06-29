import { router } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import InvoiceSubTabs from "../components/InvoiceSubTabs";

export default function CreateInvoiceScreen() {
  return (
    <View style={styles.container}>
      <InvoiceSubTabs />
      <Text>Create Invoice Screen</Text>
      <Text>
        Client, items, dates, discount and preview will come here later
      </Text>

      <Button
        title="Business Profile Reminder Test"
        onPress={() => router.push("/profile/business-edit")}
      />

      <Button
        title="Save Invoice Test"
        onPress={() => router.replace("/invoices/1")}
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
