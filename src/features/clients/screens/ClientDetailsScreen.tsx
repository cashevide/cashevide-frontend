import { useCallback, useState } from "react";
import { View } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { useClientDetails } from "../hooks/useClientDetails";
import { useDeleteClient } from "../hooks/useDeleteClient";
import { useUpdateClient } from "../hooks/useUpdateClient";
import { getFieldErrorMessage } from "@/src/shared/api/errors";
import { ROUTES } from "@/src/shared/navigation/routes";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import {
  Text,
  Button,
  Avatar,
  Badge,
  Spinner,
  ConfirmDialog,
  InfoDialog,
} from "@/src/shared/ui";

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <View className="gap-0.5">
      <Text variant="caption">{label}</Text>
      <Text variant="body">{value}</Text>
    </View>
  );
}

export default function ClientDetailsScreen() {
  const { clientSlug } = useLocalSearchParams<{ clientSlug: string }>();
  const [limitErrorMessage, setLimitErrorMessage] = useState<string | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const clientDetails = useClientDetails(clientSlug);
  const deleteClient = useDeleteClient();
  const updateClient = useUpdateClient();

  useFocusEffect(
    useCallback(() => {
      clientDetails.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientSlug]),
  );

  function handleConfirmDelete() {
    deleteClient.mutate(clientSlug, {
      onSuccess: () => {
        router.replace(ROUTES.invoices.clients.list);
      },
    });
  }

  function handleArchive() {
    updateClient.mutate({ slug: clientSlug, payload: { is_archived: true } });
  }

  function handleUnarchive() {
    updateClient.mutate(
      { slug: clientSlug, payload: { is_archived: false } },
      {
        onError: (error) => {
          setLimitErrorMessage(getFieldErrorMessage(error));
        },
      },
    );
  }

  if (clientDetails.isLoading) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader title="Client" showBackButton />
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </View>
    );
  }

  if (clientDetails.isError) {
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader title="Client" showBackButton />
        <View className="flex-1 items-center justify-center gap-3">
          <Text variant="body" className="text-muted-foreground">
            Client not found.
          </Text>
          <Button
            variant="outline"
            title="Back to Clients"
            onPress={() => router.replace(ROUTES.invoices.clients.list)}
          />
        </View>
      </View>
    );
  }

  const client = clientDetails.data;
  const isArchived = client?.is_archived ?? false;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Client" showBackButton />

      <Container variant="desktop" safeArea="bottom" scroll>
        <View className="px-6 py-6 gap-6">
          <View className="items-center gap-3">
            <Avatar name={client?.name} size={72} />

            <View className="items-center gap-1">
              <Text variant="heading">{client?.name}</Text>
              {isArchived && <Badge label="Archived" variant="default" />}
            </View>
          </View>

          <View className="bg-card border border-border rounded-lg p-4 gap-4">
            <InfoRow label="Email" value={client?.email} />
            <InfoRow label="Phone" value={client?.phone} />
            <InfoRow label="Address" value={client?.address} />
          </View>

          <View className="gap-3">
            {!isArchived && (
              <Button
                variant="primary"
                title="Edit Client"
                onPress={() =>
                  router.push(ROUTES.invoices.clients.edit(clientSlug))
                }
              />
            )}

            {isArchived ? (
              <Button
                variant="outline"
                title="Unarchive Client"
                onPress={handleUnarchive}
                isLoading={updateClient.isPending}
              />
            ) : (
              <Button
                variant="outline"
                title="Archive Client"
                onPress={handleArchive}
                isLoading={updateClient.isPending}
              />
            )}

            <Button
              variant="destructive"
              title="Delete Client"
              onPress={() => setShowDeleteConfirm(true)}
            />
          </View>
        </View>
      </Container>

      <ConfirmDialog
        visible={showDeleteConfirm}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        isConfirming={deleteClient.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <InfoDialog
        visible={limitErrorMessage !== null}
        title="Cannot Unarchive"
        message={limitErrorMessage ?? ""}
        onDismiss={() => setLimitErrorMessage(null)}
      />
    </View>
  );
}
