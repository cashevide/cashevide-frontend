import { useCallback, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  FunnelIcon,
  PlusIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";

import { useInvoices } from "../hooks/useInvoices";
import { useDebouncedValue } from "@/src/shared/hooks/useDebouncedValue";
import { ROUTES } from "@/src/shared/navigation/routes";
import { cn } from "@/src/shared/utils/cn";
import InvoiceSubTabs from "../components/InvoiceSubTabs";
import InvoiceStatusBadge from "../components/InvoiceStatusBadge";
import InvoiceFilterModal from "../components/InvoiceFilterModal";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, SearchInput, PillTabs, Spinner } from "@/src/shared/ui";

import type { InvoiceFilters } from "../components/InvoiceFilterModal";
import type { GetInvoicesParams } from "../api/invoicesApi";
import type { Invoice } from "../types/invoiceTypes";

const EMPTY_FILTERS: InvoiceFilters = {
  status: undefined,
  currency: undefined,
  from_issue_date: undefined,
  to_issue_date: undefined,
  from_due_date: undefined,
  to_due_date: undefined,
};

const ORDERING_OPTIONS: {
  key: NonNullable<GetInvoicesParams["ordering"]>;
  label: string;
}[] = [
  { key: "-created_at", label: "Newest" },
  { key: "-due_date", label: "Due Date" },
  { key: "-total_amount", label: "Amount" },
];

const STATUS_LABELS: Record<NonNullable<InvoiceFilters["status"]>, string> = {
  DRAFT: "Draft",
  UNPAID: "Unpaid",
  PARTIALLY_PAID: "Partially Paid",
  PAID: "Paid",
};

function formatAmount(amount: string, currency: string): string {
  return `${currency || ""} ${amount}`.trim();
}

// One removable chip per active filter key — lets the person see (and
// clear) exactly what's narrowing the list without reopening the filter
// modal. Each chip carries the key it clears so onRemove can null out
// just that one field.
type FilterChip = { key: keyof InvoiceFilters; label: string };

function getFilterChips(filters: InvoiceFilters): FilterChip[] {
  const chips: FilterChip[] = [];

  if (filters.status) {
    chips.push({ key: "status", label: STATUS_LABELS[filters.status] });
  }
  if (filters.currency) {
    chips.push({ key: "currency", label: filters.currency });
  }
  if (filters.from_issue_date || filters.to_issue_date) {
    chips.push({
      key: "from_issue_date",
      label: `Issued ${filters.from_issue_date ?? "…"} – ${filters.to_issue_date ?? "…"}`,
    });
  }
  if (filters.from_due_date || filters.to_due_date) {
    chips.push({
      key: "from_due_date",
      label: `Due ${filters.from_due_date ?? "…"} – ${filters.to_due_date ?? "…"}`,
    });
  }

  return chips;
}

function SkeletonRow() {
  return (
    <View className="gap-2 border-b border-border py-3">
      <View className="flex-row items-center justify-between">
        <View className="h-4 w-20 rounded bg-muted" />
        <View className="h-5 w-16 rounded-full bg-muted" />
      </View>
      <View className="flex-row items-center justify-between">
        <View className="h-3 w-32 rounded bg-muted" />
        <View className="h-3 w-16 rounded bg-muted" />
      </View>
    </View>
  );
}

export default function InvoiceListScreen() {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const [ordering, setOrdering] =
    useState<GetInvoicesParams["ordering"]>("-created_at");
  const [filters, setFilters] = useState<InvoiceFilters>(EMPTY_FILTERS);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const debouncedSearchText = useDebouncedValue(searchText, 400);

  const invoices = useInvoices({
    search: debouncedSearchText || undefined,
    ordering,
    ...filters,
  });

  useFocusEffect(
    useCallback(() => {
      invoices.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const allInvoices: Invoice[] =
    invoices.data?.pages.flatMap((page) => page.results) ?? [];
  const totalCount = invoices.data?.pages[0]?.count ?? 0;

  const chips = getFilterChips(filters);
  const filtersActive = chips.length > 0;
  const searchOrFilterActive = filtersActive || debouncedSearchText.length > 0;

  function removeChip(key: keyof InvoiceFilters) {
    if (key === "from_issue_date") {
      setFilters((prev) => ({
        ...prev,
        from_issue_date: undefined,
        to_issue_date: undefined,
      }));
      return;
    }
    if (key === "from_due_date") {
      setFilters((prev) => ({
        ...prev,
        from_due_date: undefined,
        to_due_date: undefined,
      }));
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: undefined }));
  }

  function renderInvoiceRow({ item }: { item: Invoice }) {
    return (
      <Pressable
        onPress={() => router.push(ROUTES.invoices.detail(item.id))}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        className="gap-1 border-b border-border py-3"
      >
        <View className="flex-row items-center justify-between gap-2">
          <Text variant="body" className="font-semibold">
            {item.invoice_number}
          </Text>
          <InvoiceStatusBadge status={item.status} />
        </View>

        <View className="flex-row items-center justify-between gap-2">
          <Text
            variant="body-sm"
            className="flex-1 text-muted-foreground"
            numberOfLines={1}
          >
            {item.name || "Untitled Client"}
          </Text>
          <Text variant="body-sm" className="font-semibold text-right">
            {formatAmount(item.total_amount, item.currency)}
          </Text>
        </View>

        {item.due_date && <Text variant="caption">Due {item.due_date}</Text>}
      </Pressable>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Invoices" />

      <Container variant="desktop" safeArea="bottom">
        <View className="flex-1 px-6 py-6 gap-4">
          <InvoiceSubTabs />

          <View className="flex-row items-center gap-2">
            <SearchInput
              value={searchText}
              onChangeText={setSearchText}
              onClear={() => setSearchText("")}
              placeholder="Search by invoice #, name, email or phone"
              className="flex-1"
            />

            <Pressable
              onPress={() => setFilterModalVisible(true)}
              className={cn(
                "h-12 w-12 items-center justify-center rounded-lg border",
                filtersActive
                  ? "bg-secondary border-border"
                  : "bg-card border-border",
              )}
            >
              <FunnelIcon
                width={20}
                height={20}
                color={
                  filtersActive
                    ? "rgb(var(--color-foreground))"
                    : "rgb(var(--color-muted-foreground))"
                }
              />
            </Pressable>
          </View>

          {chips.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {chips.map((chip) => (
                <Pressable
                  key={chip.key}
                  onPress={() => removeChip(chip.key)}
                  className="flex-row items-center gap-1.5 rounded-full bg-secondary border border-border pl-3 pr-2 py-1.5"
                >
                  <Text variant="body-sm">{chip.label}</Text>
                  <XMarkIcon
                    width={14}
                    height={14}
                    color="rgb(var(--color-muted-foreground))"
                  />
                </Pressable>
              ))}
            </View>
          )}

          <PillTabs
            items={ORDERING_OPTIONS}
            activeKey={ordering ?? ORDERING_OPTIONS[0].key}
            onSelect={(key) =>
              setOrdering(key as GetInvoicesParams["ordering"])
            }
          />

          {!invoices.isLoading && allInvoices.length > 0 && (
            <Text variant="caption">
              {totalCount} {totalCount === 1 ? "invoice" : "invoices"}
            </Text>
          )}

          {invoices.isLoading ? (
            <View>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </View>
          ) : allInvoices.length === 0 ? (
            <View className="items-center py-16 gap-1">
              <Text variant="body-lg" className="font-semibold">
                {searchOrFilterActive
                  ? "No matching invoices"
                  : "No invoices yet"}
              </Text>
              <Text
                variant="body-sm"
                className="text-muted-foreground text-center max-w-[280px]"
              >
                {searchOrFilterActive
                  ? "Try a different search term or clear your filters."
                  : "Create your first invoice to get started."}
              </Text>
            </View>
          ) : (
            <FlatList
              className="flex-1"
              data={allInvoices}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderInvoiceRow}
              onEndReached={() => {
                if (invoices.hasNextPage && !invoices.isFetchingNextPage) {
                  invoices.fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                invoices.isFetchingNextPage ? (
                  <View className="items-center py-4">
                    <Spinner size="sm" />
                  </View>
                ) : null
              }
            />
          )}
        </View>

        <Pressable
          onPress={() => router.push(ROUTES.invoices.create)}
          accessibilityRole="button"
          accessibilityLabel="New invoice"
          style={{ bottom: insets.bottom + 24 }}
          className="absolute right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
        >
          <PlusIcon
            width={24}
            height={24}
            color="rgb(var(--color-primary-foreground))"
          />
        </Pressable>
      </Container>

      <InvoiceFilterModal
        visible={filterModalVisible}
        initialFilters={filters}
        onApply={setFilters}
        onDismiss={() => setFilterModalVisible(false)}
      />
    </View>
  );
}
