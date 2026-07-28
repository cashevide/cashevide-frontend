import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useClientDetails } from "../hooks/useClientDetails";
import { useCreateClient } from "../hooks/useCreateClient";
import { useUpdateClient } from "../hooks/useUpdateClient";
import { ROUTES } from "@/src/shared/navigation/routes";

export default function ClientFormScreen() {
  const { clientSlug } = useLocalSearchParams<{ clientSlug?: string }>();
  const isEditMode = Boolean(clientSlug);

  const clientDetails = useClientDetails(clientSlug ?? "");
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isEditMode && clientDetails.data) {
      setName(clientDetails.data.name);
      setEmail(clientDetails.data.email);
      setPhone(clientDetails.data.phone);
      setAddress(clientDetails.data.address);
    }
  }, [isEditMode, clientDetails.data]);

  const mutation = isEditMode ? updateClient : createClient;

  const handleSave = () => {
    if (isEditMode && clientSlug) {
      updateClient.mutate(
        {
          slug: clientSlug,
          payload: { name, email, phone, address },
        },
        {
          onSuccess: (data) => {
            router.replace(ROUTES.invoices.clients.detail(data.slug));
          },
        },
      );
      return;
    }

    createClient.mutate(
      { name, email, phone, address },
      {
        onSuccess: (data) => {
          router.replace(ROUTES.invoices.clients.detail(data.slug));
        },
      },
    );
  };

  if (isEditMode && clientDetails.isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading client...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{isEditMode ? "Edit Client" : "Add Client"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email (optional)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Address (optional)"
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <Button
        title={isEditMode ? "Save Changes" : "Create Client"}
        onPress={handleSave}
        disabled={mutation.isPending || !name || !phone}
      />

      {mutation.isError && (
        <Text style={styles.error}>
          {JSON.stringify(
            (mutation.error as any)?.response?.data ?? mutation.error.message,
          )}
        </Text>
      )}

      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});
