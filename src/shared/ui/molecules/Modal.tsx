import { PropsWithChildren, ReactNode } from "react";
import { Modal as RNModal, View, StyleSheet } from "react-native";

type ModalProps = PropsWithChildren<{
  visible: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  footer?: ReactNode;
}>;

export function Modal({
  visible,
  dismissible = true,
  onDismiss,
  footer,
  children,
}: ModalProps) {
  function handleRequestClose() {
    if (dismissible) {
      onDismiss?.();
    }
  }

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleRequestClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.content}>
          <View style={styles.body}>{children}</View>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "90%",
    maxWidth: 420,
    maxHeight: "80%",
  },
  body: {
    padding: 20,
    flexShrink: 1,
  },
  footer: {
    padding: 20,
    paddingTop: 0,
  },
});
