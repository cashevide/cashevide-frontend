import { useCallback, useState } from "react";
import { FlatList, Pressable, useWindowDimensions, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PlusIcon } from "react-native-heroicons/outline";

import { useClients } from "../hooks/useClients";
import { useClientUsage } from "../hooks/useClientUsage";
import { useDebouncedValue } from "@/src/shared/hooks/useDebouncedValue";
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
      <View className="gap-2">
        <View className="h-4 w-32 rounded bg-muted" />
        <View className="h-3 w-24 rounded bg-muted" />
      </View>
    </View>
  );
}

export default function InvoiceClientsScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // Screen-width based, not Platform.OS — mobile Chrome is still
  // Platform.OS === "web", so an OS check alone would show both the
  // desktop button row AND the mobile FAB at once on a phone browser.
  // AppShell's own responsive breakpoint (frontend-work-style.md) is
  // 768px, so this mirrors that for consistency.
  const isDesktopLayout = width >= 768;
  const [searchText, setSearchText] = useState("");
  const [ordering, setOrdering] =
    useState<GetClientsParams["ordering"]>("-created_at");
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const clients = useClients({
    search: debouncedSearchText || undefined,
    ordering,
  });
  const clientUsage = useClientUsage();

  useFocusEffect(
    useCallback(() => {
      clients.refetch();
      clientUsage.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const allClients: Client[] =
    clients.data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = clients.data?.pages[0]?.count ?? 0;

  const isUsageLimitReached =
    clientUsage.data?.max_allowed_client != null &&
    clientUsage.data.current_client_count >=
      clientUsage.data.max_allowed_client;

  function handleAddClientPress() {
    if (isUsageLimitReached) {
      setShowLimitDialog(true);
      return;
    }
    router.push(ROUTES.invoices.clients.create);
  }

  function renderClientRow({ item }: { item: Client }) {
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
      </Pressable>
    );
  }

  const searchActive = debouncedSearchText.length > 0;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Clients" containerVariant="desktop" />

      <Container variant="desktop" safeArea="bottom">
        <View className="flex-1 px-6 py-6 gap-4">
          <InvoiceSubTabs />

          <View className="flex-row items-center gap-2">
            <SearchInput
              value={searchText}
              onChangeText={setSearchText}
              onClear={() => setSearchText("")}
              placeholder="Search by name, email or phone"
              className="flex-1"
            />

            {isDesktopLayout && (
              <Button
                variant="brand"
                title="New Client"
                leftIcon={
                  <PlusIcon color="rgb(var(--color-brand-foreground))" />
                }
                onPress={handleAddClientPress}
              />
            )}
          </View>

          <SegmentedTabs
            items={ORDERING_OPTIONS}
            activeKey={ordering ?? ORDERING_OPTIONS[0].key}
            onSelect={(key) => setOrdering(key as GetClientsParams["ordering"])}
          />

          <View className="flex-row items-center justify-between px-7">
            {!clients.isLoading && allClients.length > 0 ? (
              <Text variant="caption">
                {totalCount} {totalCount === 1 ? "client" : "clients"}
              </Text>
            ) : (
              <View />
            )}

            <Pressable
              onPress={() => router.push(ROUTES.invoices.clients.archived)}
            >
              <Text variant="body-sm" className="text-link">
                Archived
              </Text>
            </Pressable>
          </View>

          {clients.isLoading ? (
            <View>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </View>
          ) : allClients.length === 0 ? (
            <View className="items-center py-16 gap-1">
              <Text variant="body-lg" className="font-semibold">
                {searchActive ? "No matching clients" : "No clients yet"}
              </Text>
              <Text
                variant="body-sm"
                className="text-muted-foreground text-center max-w-[280px]"
              >
                {searchActive
                  ? "Try a different search term."
                  : "Add your first client to get started."}
              </Text>
            </View>
          ) : (
            <FlatList
              className="flex-1"
              data={allClients}
              keyExtractor={(item) => item.slug}
              renderItem={renderClientRow}
              ItemSeparatorComponent={() => <View className="h-3" />}
              // web:pr-2 keeps the browser's native scrollbar off the
              // card content — see Container.tsx's ScrollView.
              contentContainerClassName="web:pr-2"
              onEndReached={() => {
                if (clients.hasNextPage && !clients.isFetchingNextPage) {
                  clients.fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                clients.isFetchingNextPage ? (
                  <View className="items-center py-4">
                    <Spinner size="sm" />
                  </View>
                ) : null
              }
            />
          )}
        </View>

        {!isDesktopLayout && (
          <Pressable
            onPress={handleAddClientPress}
            accessibilityRole="button"
            accessibilityLabel="Add client"
            style={{ bottom: insets.bottom + 24 }}
            className="absolute right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
          >
            <PlusIcon
              width={24}
              height={24}
              color="rgb(var(--color-primary-foreground))"
            />
          </Pressable>
        )}
      </Container>

      <InfoDialog
        visible={showLimitDialog}
        title="Client Limit Reached"
        message={`You cannot add more than ${clientUsage.data?.max_allowed_client} clients in your current plan.`}
        onDismiss={() => setShowLimitDialog(false)}
      />
    </View>
  );
}
