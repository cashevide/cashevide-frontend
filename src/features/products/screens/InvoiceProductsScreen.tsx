import { useCallback, useState } from "react";
import { FlatList, Pressable, useWindowDimensions, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PlusIcon } from "react-native-heroicons/outline";

import { useProducts } from "../hooks/useProducts";
import { useProductUsage } from "../hooks/useProductUsage";
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
    <View className="gap-2 border-b border-border py-3">
      <View className="flex-row items-center justify-between">
        <View className="h-4 w-32 rounded bg-muted" />
        <View className="h-4 w-16 rounded bg-muted" />
      </View>
      <View className="h-3 w-48 rounded bg-muted" />
    </View>
  );
}

export default function InvoiceProductsScreen() {
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
    useState<GetProductsParams["ordering"]>("-created_at");
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const products = useProducts({
    search: debouncedSearchText || undefined,
    ordering,
  });
  const productUsage = useProductUsage();

  useFocusEffect(
    useCallback(() => {
      products.refetch();
      productUsage.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const allProducts: Product[] =
    products.data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = products.data?.pages[0]?.count ?? 0;

  const isUsageLimitReached =
    productUsage.data?.max_allowed_product != null &&
    productUsage.data.current_product_count >=
      productUsage.data.max_allowed_product;

  function handleAddProductPress() {
    if (isUsageLimitReached) {
      setShowLimitDialog(true);
      return;
    }
    router.push(ROUTES.invoices.products.create);
  }

  function renderProductRow({ item }: { item: Product }) {
    return (
      <Pressable
        onPress={() => router.push(ROUTES.invoices.products.detail(item.slug))}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        className="gap-1 bg-card border border-border rounded-lg p-4"
      >
        <View className="flex-row items-center justify-between gap-2">
          <Text
            variant="body-lg"
            className="flex-1 font-semibold"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text variant="body-sm" className="font-semibold">
            ₹{item.unit_price}
          </Text>
        </View>

        {!!item.description && (
          <Text
            variant="body-sm"
            className="text-muted-foreground"
            numberOfLines={1}
          >
            {item.description}
          </Text>
        )}
      </Pressable>
    );
  }

  const searchActive = debouncedSearchText.length > 0;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader containerVariant="desktop">
        <View className="flex-row items-center justify-between">
          <Text variant="body-lg" className="font-semibold web:text-2xl">
            Products
          </Text>

          {isDesktopLayout && (
            <Button
              variant="brand"
              shape="md"
              size="sm"
              title="New Product"
              leftIcon={
                <PlusIcon
                  width={16}
                  height={16}
                  color="rgb(var(--color-brand-foreground))"
                />
              }
              onPress={handleAddProductPress}
            />
          )}
        </View>
      </ScreenHeader>

      <Container variant="desktop" safeArea="bottom">
        <View className="flex-1 px-6 py-6 gap-4">
          <InvoiceSubTabs />

          <View className="flex-row items-center gap-2">
            <SearchInput
              value={searchText}
              onChangeText={setSearchText}
              onClear={() => setSearchText("")}
              placeholder="Search by title"
              className="flex-1"
            />
          </View>

          <SegmentedTabs
            items={ORDERING_OPTIONS}
            activeKey={ordering ?? ORDERING_OPTIONS[0].key}
            onSelect={(key) =>
              setOrdering(key as GetProductsParams["ordering"])
            }
          />

          <View className="flex-row items-center justify-between px-7">
            {!products.isLoading && allProducts.length > 0 ? (
              <Text variant="caption">
                {totalCount} {totalCount === 1 ? "product" : "products"}
              </Text>
            ) : (
              <View />
            )}

            <Pressable
              onPress={() => router.push(ROUTES.invoices.products.archived)}
            >
              <Text variant="body-sm" className="text-link">
                Archived
              </Text>
            </Pressable>
          </View>

          {products.isLoading ? (
            <View>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </View>
          ) : allProducts.length === 0 ? (
            <View className="items-center py-16 gap-1">
              <Text variant="body-lg" className="font-semibold">
                {searchActive ? "No matching products" : "No products yet"}
              </Text>
              <Text
                variant="body-sm"
                className="text-muted-foreground text-center max-w-[280px]"
              >
                {searchActive
                  ? "Try a different search term."
                  : "Add your first product to get started."}
              </Text>
            </View>
          ) : (
            <FlatList
              className="flex-1"
              data={allProducts}
              keyExtractor={(item) => item.slug}
              renderItem={renderProductRow}
              ItemSeparatorComponent={() => <View className="h-3" />}
              // web:pr-2 keeps the browser's native scrollbar off the
              // card content — see Container.tsx's ScrollView.
              contentContainerClassName="web:pr-2"
              onEndReached={() => {
                if (products.hasNextPage && !products.isFetchingNextPage) {
                  products.fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                products.isFetchingNextPage ? (
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
            onPress={handleAddProductPress}
            accessibilityRole="button"
            accessibilityLabel="Add product"
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
        title="Product Limit Reached"
        message={`You cannot add more than ${productUsage.data?.max_allowed_product} products in your current plan.`}
        onDismiss={() => setShowLimitDialog(false)}
      />
    </View>
  );
}
