import { useCallback, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { useProducts } from "../hooks/useProducts";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
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
  PillTabs,
  Spinner,
  InfoDialog,
} from "@/src/shared/ui";

import type { GetProductsParams } from "../api/productsApi";
import type { Product } from "../types/productTypes";

const ORDERING_OPTIONS: {
  key: NonNullable<GetProductsParams["ordering"]>;
  label: string;
}[] = [
  { key: "-created_at", label: "Newest" },
  { key: "title", label: "Title A-Z" },
];

function SkeletonRow() {
  return (
    <View className="flex-row items-center gap-3 border-b border-border py-3">
      <View className="flex-1 gap-2">
        <View className="h-4 w-32 rounded bg-muted" />
        <View className="h-3 w-24 rounded bg-muted" />
      </View>
    </View>
  );
}

export default function ArchivedProductsScreen() {
  const [searchText, setSearchText] = useState("");
  const [ordering, setOrdering] =
    useState<GetProductsParams["ordering"]>("-created_at");
  const [limitErrorMessage, setLimitErrorMessage] = useState<string | null>(
    null,
  );

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const archivedProducts = useProducts({
    search: debouncedSearchText || undefined,
    ordering,
    is_archived: true,
  });

  const updateProduct = useUpdateProduct();

  useFocusEffect(
    useCallback(() => {
      archivedProducts.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const allArchivedProducts: Product[] =
    archivedProducts.data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = archivedProducts.data?.pages[0]?.count ?? 0;

  function handleUnarchive(slug: string) {
    updateProduct.mutate(
      { slug, payload: { is_archived: false } },
      {
        onSuccess: () => {
          archivedProducts.refetch();
        },
        onError: (error) => {
          setLimitErrorMessage(getFieldErrorMessage(error));
        },
      },
    );
  }

  function renderProductRow({ item }: { item: Product }) {
    const isUnarchiving =
      updateProduct.isPending && updateProduct.variables?.slug === item.slug;

    return (
      <Pressable
        onPress={() => router.push(ROUTES.invoices.products.detail(item.slug))}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        className="flex-row items-center gap-3 border-b border-border py-3"
      >
        <View className="flex-1 gap-0.5">
          <Text variant="body" className="font-semibold" numberOfLines={1}>
            {item.title}
          </Text>
          <Text
            variant="body-sm"
            className="text-muted-foreground"
            numberOfLines={1}
          >
            ₹{item.unit_price}
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
        title="Archived Products"
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
            placeholder="Search by title"
          />

          <PillTabs
            items={ORDERING_OPTIONS}
            activeKey={ordering ?? ORDERING_OPTIONS[0].key}
            onSelect={(key) =>
              setOrdering(key as GetProductsParams["ordering"])
            }
          />

          {!archivedProducts.isLoading && allArchivedProducts.length > 0 && (
            <Text variant="caption">
              {totalCount} archived {totalCount === 1 ? "product" : "products"}
            </Text>
          )}

          {archivedProducts.isLoading ? (
            <View>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </View>
          ) : allArchivedProducts.length === 0 ? (
            <View className="items-center py-16 gap-1">
              <Text variant="body-lg" className="font-semibold">
                {searchActive ? "No matching products" : "No archived products"}
              </Text>
              <Text
                variant="body-sm"
                className="text-muted-foreground text-center max-w-[280px]"
              >
                {searchActive
                  ? "Try a different search term."
                  : "Products you archive will show up here."}
              </Text>
            </View>
          ) : (
            <FlatList
              className="flex-1"
              data={allArchivedProducts}
              keyExtractor={(item) => item.slug}
              renderItem={renderProductRow}
              onEndReached={() => {
                if (
                  archivedProducts.hasNextPage &&
                  !archivedProducts.isFetchingNextPage
                ) {
                  archivedProducts.fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                archivedProducts.isFetchingNextPage ? (
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
