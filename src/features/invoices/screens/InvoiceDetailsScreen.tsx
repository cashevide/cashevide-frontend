import { useCallback } from "react";
import { Alert, useWindowDimensions, View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { useInvoiceDetails } from "../hooks/useInvoiceDetails";
import { useDeleteInvoice } from "../hooks/useDeleteInvoice";
import { useDownloadInvoicePdf } from "../hooks/useDownloadInvoicePdf";
import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Spinner } from "@/src/shared/ui";
import InvoicePreview from "../components/InvoicePreview";
import InvoiceActionBar from "../components/InvoiceActionBar";

export default function InvoiceDetailsScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();
  const id = Number(invoiceId);
  const { width } = useWindowDimensions();
  // Same 768px breakpoint used across the app (see InvoiceListScreen,
  // CreateInvoiceScreen) — below it there isn't room for a preview +
  // sidebar side by side.
  const isDesktopLayout = width >= 768;

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
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Invoice"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="desktop" safeArea="bottom">
          <View className="flex-1 items-center justify-center">
            <Text variant="body" className="text-muted-foreground">
              Invalid invoice.
            </Text>
          </View>
        </Container>
      </View>
    );
  }

  if (invoiceDetails.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Invoice"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="desktop" safeArea="bottom">
          <View className="flex-1 items-center justify-center">
            <Spinner />
          </View>
        </Container>
      </View>
    );
  }

  if (invoiceDetails.isError || !invoiceDetails.data) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Invoice"
          showBackButton
          containerVariant="desktop"
        />
        <Container variant="desktop" safeArea="bottom">
          <View className="flex-1 items-center justify-center">
            <Text variant="body" className="text-muted-foreground">
              This invoice could not be found.
            </Text>
          </View>
        </Container>
      </View>
    );
  }

  const invoice = invoiceDetails.data;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title={invoice.invoice_number}
        showBackButton
        containerVariant="desktop"
      />

      <Container variant="desktop" safeArea="bottom" scroll>
        <View
          className={
            isDesktopLayout
              ? "flex-row items-start gap-8 px-6 py-6"
              : "gap-6 px-6 py-6"
          }
        >
          <View className={isDesktopLayout ? "flex-1" : undefined}>
            <InvoicePreview invoice={invoice} />
          </View>

          <View className={isDesktopLayout ? "w-[280px]" : undefined}>
            <InvoiceActionBar
              onEdit={handleEdit}
              onRecordPayment={handleRecordPayment}
              onDownloadPdf={handleDownloadPdf}
              onDelete={handleDelete}
              isDownloading={downloadPdf.isPending}
              isDeleting={deleteInvoice.isPending}
              layout={isDesktopLayout ? "stack" : "rows"}
            />
          </View>
        </View>
      </Container>
    </View>
  );
}
