import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";

import { Modal } from "@/src/shared/ui";
import { useDeleteAccount } from "../hooks/useDeleteAccount";

type DeleteAccountModalProps = {
  visible: boolean;
  username: string;
  onDismiss: () => void;
};

type Step = "confirm" | "typeUsername";

export function DeleteAccountModal({
  visible,
  username,
  onDismiss,
}: DeleteAccountModalProps) {
  const [step, setStep] = useState<Step>("confirm");
  const [typedUsername, setTypedUsername] = useState("");

  const deleteAccountMutation = useDeleteAccount();

  function handleClose() {
    setStep("confirm");
    setTypedUsername("");
    onDismiss();
  }

  function handleConfirmYes() {
    setStep("typeUsername");
  }

  function handleDelete() {
    deleteAccountMutation.mutate();
  }

  const isUsernameMatching =
    typedUsername.trim() === username && username.length > 0;

  return (
    <Modal visible={visible} dismissible onDismiss={handleClose}>
      {step === "confirm" ? (
        <View style={styles.container}>
          <Text style={styles.title}>Delete Account</Text>

          <Text>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Text>

          <View style={styles.row}>
            <Button title="No" onPress={handleClose} />
            <Button title="Yes" onPress={handleConfirmYes} />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Confirm Deletion</Text>

          <Text>
            This will permanently delete your account and all associated data.
            Type your username <Text style={styles.username}>{username}</Text>{" "}
            to confirm.
          </Text>

          <TextInput
            value={typedUsername}
            onChangeText={setTypedUsername}
            placeholder="Type your username"
            autoCapitalize="none"
            style={styles.input}
          />

          {deleteAccountMutation.isError ? (
            <Text style={styles.error}>
              Could not delete your account. Please try again.
            </Text>
          ) : null}

          <View style={styles.row}>
            <Button title="Cancel" onPress={handleClose} />

            {deleteAccountMutation.isPending ? (
              <ActivityIndicator />
            ) : (
              <Button
                title="Confirm Delete"
                onPress={handleDelete}
                disabled={!isUsernameMatching}
              />
            )}
          </View>
        </View>
      )}
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
  username: {
    fontWeight: "600",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#999",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  error: {
    color: "red",
  },
});
