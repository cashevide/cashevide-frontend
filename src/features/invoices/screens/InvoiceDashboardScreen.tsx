import { useCallback, useState } from "react";
import { View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { useInvoiceDashboard } from "../hooks/useInvoiceDashboard";
import { ROUTES } from "@/src/shared/navigation/routes";
import { getAvailableCurrencies } from "../utils/invoiceDashboardUtils";
import InvoiceSubTabs from "../components/InvoiceSubTabs";
import DashboardCurrencyTabs from "../components/DashboardCurrencyTabs";
import DashboardReceivedCard from "../components/DashboardReceivedCard";
import DashboardBalanceDueCard from "../components/DashboardBalanceDueCard";
import DashboardSummaryCard from "../components/DashboardSummaryCard";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Button, Spinner } from "@/src/shared/ui";

import type { InvoiceDashboardResponse } from "../types/invoiceDashboardTypes";

export default function InvoiceDashboardScreen() {
  const dashboard = useInvoiceDashboard();
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      dashboard.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Invoices" containerVariant="desktop" />

      <Container variant="desktop" safeArea="bottom" scroll>
        <View className="px-6 py-6 gap-6">
          <InvoiceSubTabs />

          {dashboard.isLoading ? (
            <View className="items-center py-16">
              <Spinner />
            </View>
          ) : dashboard.isError || !dashboard.data ? (
            <View className="items-center py-16">
              <Text variant="body" className="text-muted-foreground">
                Could not load dashboard data.
              </Text>
            </View>
          ) : (
            <DashboardContent
              data={dashboard.data}
              selectedCurrency={selectedCurrency}
              onSelectCurrency={setSelectedCurrency}
            />
          )}
        </View>
      </Container>
    </View>
  );
}

function DashboardContent({
  data,
  selectedCurrency,
  onSelectCurrency,
}: {
  data: InvoiceDashboardResponse;
  selectedCurrency: string | null;
  onSelectCurrency: (currency: string) => void;
}) {
  const { revenue, balance_due } = data;
  const availableCurrencies = getAvailableCurrencies(
    revenue.total,
    balance_due.total,
  );
  const activeCurrency = selectedCurrency ?? availableCurrencies[0] ?? null;

  if (availableCurrencies.length === 0) {
    return (
      <View className="items-center gap-2 py-16">
        <Text variant="body-lg" className="font-semibold">
          No invoices yet
        </Text>
        <Text
          variant="body-sm"
          className="text-muted-foreground text-center max-w-[280px]"
        >
          Create your first invoice to start tracking revenue and outstanding
          balances.
        </Text>
        <View className="mt-2">
          <Button
            variant="primary"
            title="New Invoice"
            onPress={() => router.push(ROUTES.invoices.create)}
          />
        </View>
      </View>
    );
  }

  return (
    <>
      <DashboardCurrencyTabs
        currencies={availableCurrencies}
        selectedCurrency={activeCurrency}
        onSelect={onSelectCurrency}
      />

      {activeCurrency && (
        <View className="gap-4">
          <View className="flex-row gap-3">
            <DashboardReceivedCard
              totalRevenue={revenue.total}
              currency={activeCurrency}
            />
            <DashboardBalanceDueCard
              totalBalanceDue={balance_due.total}
              currency={activeCurrency}
            />
          </View>

          <DashboardSummaryCard
            thisMonth={revenue.this_month}
            lastMonth={revenue.last_month}
            lastThreeMonths={revenue.last_three_months}
            thisYear={revenue.this_year}
            lastYear={revenue.last_year}
            currency={activeCurrency}
          />
        </View>
      )}
    </>
  );
}
