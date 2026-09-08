import { useState } from "react";
import { View } from "react-native";
import {
  ArrowDownTrayIcon,
  CreditCardIcon,
  PencilIcon,
  TrashIcon,
} from "react-native-heroicons/outline";

import { Button, ConfirmDialog } from "@/src/shared/ui";
import { cn } from "@/src/shared/utils/cn";

import type { InvoiceStatus } from "../types/invoiceTypes";

type InvoiceActionBarProps = {
  status: InvoiceStatus;
  onEdit: () => void;
  onRecordPayment: () => void;
  onDownloadPdf: () => void;
  onDelete: () => void;
  isDownloading?: boolean;
  isDeleting?: boolean;
  // "rows" (default): primary actions side-by-side, secondary actions
  // side-by-side below — used when this sits below the preview on
  // mobile/narrow layouts. "stack": every action full-width, one per
  // row — used in the desktop sidebar, where the column is narrow but
  // tall.
  layout?: "rows" | "stack";
};

export default function InvoiceActionBar({
  status,
  onEdit,
  onRecordPayment,
  onDownloadPdf,
  onDelete,
  isDownloading = false,
  isDeleting = false,
  layout = "rows",
}: InvoiceActionBarProps) {
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  function handleDeleteConfirmed() {
    setDeleteConfirmVisible(false);
    onDelete();
  }

  const isStack = layout === "stack";
  const isPaid = status === "PAID";

  // This button opens the payments section of the edit screen, which
  // supports editing and removing existing payment records, not just
  // adding new ones (see EditInvoiceScreen's handleRemovePayment) — so
  // it stays visible and enabled on a PAID invoice too, for correcting
  // a mistaken entry. Only the label changes once paid, since "Record
  // Payment" reads like there's still an outstanding balance to
  // collect, which isn't true anymore — "Manage Payments" doesn't
  // imply that.
  const recordPaymentLabel = isPaid ? "Manage Payments" : "Record Payment";

  return (
    <View className="gap-3">
      <View className={cn("gap-3", !isStack && "flex-row")}>
        <View className={cn(!isStack && "flex-1")}>
          <Button
            variant="primary"
            title="Edit"
            leftIcon={<PencilIcon />}
            onPress={onEdit}
            fullWidth
          />
        </View>
        <View className={cn(!isStack && "flex-1")}>
          <Button
            variant="secondary"
            title={recordPaymentLabel}
            leftIcon={<CreditCardIcon />}
            onPress={onRecordPayment}
            fullWidth
          />
        </View>
      </View>

      <View className={cn("gap-3", !isStack && "flex-row")}>
        <View className={cn(!isStack && "flex-1")}>
          <Button
            variant="outline"
            title={isDownloading ? "Preparing PDF..." : "Download / Share PDF"}
            leftIcon={<ArrowDownTrayIcon />}
            onPress={onDownloadPdf}
            disabled={isDownloading}
            fullWidth
          />
        </View>
        <View className={cn(!isStack && "flex-1")}>
          <Button
            variant="destructive"
            title={isDeleting ? "Deleting..." : "Delete Invoice"}
            leftIcon={<TrashIcon />}
            onPress={() => setDeleteConfirmVisible(true)}
            disabled={isDeleting}
            fullWidth
          />
        </View>
      </View>

      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="Delete this invoice?"
        message={
          isPaid
            ? "This invoice has been marked as paid. Deleting it will permanently remove the invoice and its payment history. This action cannot be undone."
            : "This invoice will be removed from your list. This action cannot be undone."
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        isConfirming={isDeleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteConfirmVisible(false)}
      />
    </View>
  );
}
