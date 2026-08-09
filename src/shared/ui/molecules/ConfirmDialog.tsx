import { View } from "react-native";

import { Button, Spinner } from "@/src/shared/ui";
import { Modal } from "./Modal";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      dismissible
      onDismiss={onCancel}
      title={title}
      description={message}
      footer={
        <View className="flex-row justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            title={cancelLabel}
            onPress={onCancel}
            disabled={isConfirming}
          />

          {isConfirming ? (
            <Spinner size="sm" />
          ) : (
            <Button
              variant={destructive ? "destructive" : "primary"}
              size="sm"
              title={confirmLabel}
              onPress={onConfirm}
            />
          )}
        </View>
      }
    />
  );
}
