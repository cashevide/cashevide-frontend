import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ConfirmDialog } from "@/src/shared/ui";

type InvoiceActionBarProps = {
  onEdit: () => void;
  onRecordPayment: () => void;
  onDownloadPdf: () => void;
  onDelete: () => void;
  isDownloading?: boolean;
  isDeleting?: boolean;
};

export default function InvoiceActionBar({
  onEdit,
  onRecordPayment,
  onDownloadPdf,
  onDelete,
  isDownloading = false,
  isDeleting = false,
}: InvoiceActionBarProps) {
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  function handleDeleteConfirmed() {
    setDeleteConfirmVisible(false);
    onDelete();
  }

  return (
    <View style={styles.container}>
      <View style={styles.primaryRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={onEdit}>
          <Text style={styles.primaryButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onRecordPayment}
        >
          <Text style={styles.primaryButtonText}>Record Payment</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.secondaryRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onDownloadPdf}
          disabled={isDownloading}
        >
          <Text style={styles.secondaryButtonText}>
            {isDownloading ? "Preparing PDF..." : "Download / Share PDF"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setDeleteConfirmVisible(true)}
          disabled={isDeleting}
        >
          <Text style={styles.deleteButtonText}>
            {isDeleting ? "Deleting..." : "Delete Invoice"}
          </Text>
        </TouchableOpacity>
      </View>

      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="Delete this invoice?"
        message="This invoice will be removed from your list. This action cannot be undone."
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

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  primaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#3399ff",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  secondaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#333",
  },
  deleteButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e53935",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#e53935",
    fontWeight: "bold",
  },
});
