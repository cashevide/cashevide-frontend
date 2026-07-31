import { useCallback } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { useInvoiceDetails } from "../hooks/useInvoiceDetails";
import { useDeleteInvoice } from "../hooks/useDeleteInvoice";
import { useDownloadInvoicePdf } from "../hooks/useDownloadInvoicePdf";
import { ROUTES } from "@/src/shared/navigation/routes";
import InvoicePreview from "../components/InvoicePreview";
import InvoiceActionBar from "../components/InvoiceActionBar";

export default function InvoiceDetailsScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();
  const id = Number(invoiceId);

  const invoiceDetails = useInvoiceDetails(id, { enabled: !Number.isNaN(id) });
  const deleteInvoice = useDeleteInvoice();
  const downloadPdf = useDownloadInvoicePdf();

  useFocusEffect(
    useCallback(() => {
      if (!Number.isNaN(id)) {
        invoiceDetails.refetch();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]),
  );

  function handleEdit() {
    router.push(ROUTES.invoices.edit(id));
  }

  function handleRecordPayment() {
    router.push(ROUTES.invoices.edit(id, "payments"));
  }

  function handleDownloadPdf() {
    downloadPdf.mutate(id, {
      onError: () => {
        Alert.alert(
          "Download failed",
          "Could not download the invoice PDF. Please try again.",
        );
      },
    });
  }

  function handleDelete() {
    deleteInvoice.mutate(id, {
      onSuccess: () => {
        router.replace(ROUTES.invoices.list);
      },
      onError: () => {
        Alert.alert(
          "Delete failed",
          "Could not delete this invoice. Please try again.",
        );
      },
    });
  }

  if (Number.isNaN(id)) {
    return (
      <View style={styles.centered}>
        <Text>Invalid invoice.</Text>
      </View>
    );
  }

  if (invoiceDetails.isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading invoice...</Text>
      </View>
    );
  }

  if (invoiceDetails.isError || !invoiceDetails.data) {
    return (
      <View style={styles.centered}>
        <Text>This invoice could not be found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <InvoicePreview invoice={invoiceDetails.data} />

      <InvoiceActionBar
        onEdit={handleEdit}
        onRecordPayment={handleRecordPayment}
        onDownloadPdf={handleDownloadPdf}
        onDelete={handleDelete}
        isDownloading={downloadPdf.isPending}
        isDeleting={deleteInvoice.isPending}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
