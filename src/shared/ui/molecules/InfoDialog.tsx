import { StyleSheet, Text, View, Button } from "react-native";

import { Modal } from "./Modal";

type InfoDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  onDismiss: () => void;
};

export function InfoDialog({
  visible,
  title,
  message,
  buttonLabel = "OK",
  onDismiss,
}: InfoDialogProps) {
  return (
    <Modal visible={visible} dismissible onDismiss={onDismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.row}>
          <Button title={buttonLabel} onPress={onDismiss} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  message: {
    fontSize: 14,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
