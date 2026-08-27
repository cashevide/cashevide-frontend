import { useCallback, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { useClients } from "../hooks/useClients";
import { useUpdateClient } from "../hooks/useUpdateClient";
import { useDebouncedValue } from "@/src/shared/hooks/useDebouncedValue";
import { getFieldErrorMessage } from "@/src/shared/api/errors";
import { ROUTES } from "@/src/shared/navigation/routes";
import InvoiceSubTabs from "@/src/features/invoices/components/InvoiceSubTabs";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import {
  Text,
  Button,
  SearchInput,
  SegmentedTabs,
  Spinner,
  Avatar,
  InfoDialog,
} from "@/src/shared/ui";

import type { GetClientsParams } from "../api/clientsApi";
import type { Client } from "../types/clientTypes";

const ORDERING_OPTIONS: {
  key: NonNullable<GetClientsParams["ordering"]>;
  label: string;
}[] = [
  { key: "-created_at", label: "Newest" },
  { key: "name", label: "Name A-Z" },
];

function SkeletonRow() {
  return (
    <View className="flex-row items-center gap-3 border-b border-border py-3">
      <View className="h-10 w-10 rounded-full bg-muted" />
      <View className="flex-1 gap-2">
        <View className="h-4 w-32 rounded bg-muted" />
        <View className="h-3 w-24 rounded bg-muted" />
      </View>
    </View>
  );
}

export default function ArchivedClientsScreen() {
  const [searchText, setSearchText] = useState("");
  const [ordering, setOrdering] =
    useState<GetClientsParams["ordering"]>("-created_at");
  const [limitErrorMessage, setLimitErrorMessage] = useState<string | null>(
    null,
  );

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const archivedClients = useClients({
    search: debouncedSearchText || undefined,
    ordering,
    is_archived: true,
  });

  const updateClient = useUpdateClient();

  useFocusEffect(
    useCallback(() => {
      archivedClients.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const allArchivedClients: Client[] =
    archivedClients.data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = archivedClients.data?.pages[0]?.count ?? 0;

  function handleUnarchive(slug: string) {
    updateClient.mutate(
      { slug, payload: { is_archived: false } },
      {
        onSuccess: () => {
          archivedClients.refetch();
        },
        onError: (error) => {
          setLimitErrorMessage(getFieldErrorMessage(error));
        },
      },
    );
  }

  function renderClientRow({ item }: { item: Client }) {
    const isUnarchiving =
      updateClient.isPending && updateClient.variables?.slug === item.slug;

    return (
      <Pressable
        onPress={() => router.push(ROUTES.invoices.clients.detail(item.slug))}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        className="flex-row items-center gap-3 bg-card border border-border rounded-lg p-4"
      >
        <Avatar name={item.name} size={40} />

        <View className="flex-1 gap-0.5">
          <Text variant="body-lg" className="font-semibold" numberOfLines={1}>
            {item.name}
          </Text>
          <Text
            variant="body-sm"
            className="text-muted-foreground"
            numberOfLines={1}
          >
            {item.phone || item.email || "No contact info"}
          </Text>
        </View>

        <Button
          variant="outline"
          size="sm"
          title="Unarchive"
          onPress={() => handleUnarchive(item.slug)}
          isLoading={isUnarchiving}
        />
      </Pressable>
    );
  }

  const searchActive = debouncedSearchText.length > 0;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Archived Clients"
        showBackButton
        containerVariant="desktop"
      />

      <Container variant="desktop" safeArea="bottom">
        <View className="flex-1 px-6 py-6 gap-4">
          <InvoiceSubTabs />

          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            onClear={() => setSearchText("")}
            placeholder="Search by name, email or phone"
          />

          <SegmentedTabs
            items={ORDERING_OPTIONS}
            activeKey={ordering ?? ORDERING_OPTIONS[0].key}
            onSelect={(key) => setOrdering(key as GetClientsParams["ordering"])}
          />

          {!archivedClients.isLoading && allArchivedClients.length > 0 && (
            <Text variant="caption" className="px-7">
              {totalCount} archived {totalCount === 1 ? "client" : "clients"}
            </Text>
          )}

          {archivedClients.isLoading ? (
            <View>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </View>
          ) : allArchivedClients.length === 0 ? (
            <View className="items-center py-16 gap-1">
              <Text variant="body-lg" className="font-semibold">
                {searchActive ? "No matching clients" : "No archived clients"}
              </Text>
              <Text
                variant="body-sm"
                className="text-muted-foreground text-center max-w-[280px]"
              >
                {searchActive
                  ? "Try a different search term."
                  : "Clients you archive will show up here."}
              </Text>
            </View>
          ) : (
            <FlatList
              className="flex-1"
              data={allArchivedClients}
              keyExtractor={(item) => item.slug}
              renderItem={renderClientRow}
              ItemSeparatorComponent={() => <View className="h-3" />}
              // web:pr-2 keeps the browser's native scrollbar off the
              // card content — see Container.tsx's ScrollView.
              contentContainerClassName="web:pr-2"
              onEndReached={() => {
                if (
                  archivedClients.hasNextPage &&
                  !archivedClients.isFetchingNextPage
                ) {
                  archivedClients.fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                archivedClients.isFetchingNextPage ? (
                  <View className="items-center py-4">
                    <Spinner size="sm" />
                  </View>
                ) : null
              }
            />
          )}
        </View>
      </Container>

      <InfoDialog
        visible={limitErrorMessage !== null}
        title="Cannot Unarchive"
        message={limitErrorMessage ?? ""}
        onDismiss={() => setLimitErrorMessage(null)}
      />
    </View>
  );
}
