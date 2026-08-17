import { useEffect, useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { useClientDetails } from "../hooks/useClientDetails";
import { useCreateClient } from "../hooks/useCreateClient";
import { useUpdateClient } from "../hooks/useUpdateClient";
import { getFieldErrorMessage } from "@/src/shared/api/errors";
import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import {
  Text,
  Input,
  Button,
  Spinner,
  PhoneNumberInput,
} from "@/src/shared/ui";

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
  const errorMessage = mutation.isError
    ? getFieldErrorMessage(mutation.error)
    : null;

  function handleSave() {
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
  }

  if (isEditMode && clientDetails.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader
          title="Edit Client"
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

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title={isEditMode ? "Edit Client" : "Add Client"}
        showBackButton
        containerVariant="desktop"
      />

      <Container variant="desktop" safeArea="bottom" scroll>
        <View className="gap-4 px-6 py-6">
          <Input placeholder="Name" value={name} onChangeText={setName} />

          <Input
            placeholder="Email (optional)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* PhoneNumberInput manages country code + number as internal
              state and only emits the combined value — it has no way to
              be pre-filled with an existing number. On create there's
              nothing to pre-fill, so it's used for its country picker
              and formatting. On edit, the client's phone (already a
              full "+<code><number>" string from the backend) is shown
              as plain editable text instead. */}
          {isEditMode ? (
            <Input
              placeholder="Phone"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          ) : (
            <PhoneNumberInput onChangeFullNumber={setPhone} />
          )}

          <Input
            placeholder="Address (optional)"
            value={address}
            onChangeText={setAddress}
            multiline
          />

          {errorMessage && (
            <Text variant="body-sm" className="text-center text-destructive">
              {errorMessage}
            </Text>
          )}

          <Button
            variant="primary"
            title={isEditMode ? "Save Changes" : "Create Client"}
            onPress={handleSave}
            disabled={!name.trim() || !phone.trim()}
            isLoading={mutation.isPending}
          />
        </View>
      </Container>
    </View>
  );
}
