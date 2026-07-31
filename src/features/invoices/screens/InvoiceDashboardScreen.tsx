import { useCallback, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { useInvoiceDashboard } from "../hooks/useInvoiceDashboard";
import { ROUTES } from "@/src/shared/navigation/routes";
import { getAvailableCurrencies } from "../utils/invoiceDashboardUtils";
import InvoiceSubTabs from "../components/InvoiceSubTabs";
import DashboardCurrencyTabs from "../components/DashboardCurrencyTabs";
import DashboardReceivedCard from "../components/DashboardReceivedCard";
import DashboardBalanceDueCard from "../components/DashboardBalanceDueCard";
import DashboardSummaryCard from "../components/DashboardSummaryCard";

export default function InvoiceDashboardScreen() {
  const dashboard = useInvoiceDashboard();
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      dashboard.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  if (dashboard.isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <View style={styles.centered}>
        <Text>Could not load dashboard data.</Text>
      </View>
    );
  }

  const { revenue, balance_due } = dashboard.data;
  const availableCurrencies = getAvailableCurrencies(
    revenue.total,
    balance_due.total,
  );

  const activeCurrency = selectedCurrency ?? availableCurrencies[0] ?? null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <InvoiceSubTabs />

      {availableCurrencies.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No invoices yet</Text>
          <Text style={styles.emptyText}>
            Create your first invoice to start tracking revenue and outstanding
            balances.
          </Text>
          <Button
            title="New Invoice"
            onPress={() => router.push(ROUTES.invoices.create)}
          />
        </View>
      ) : (
        <>
          <DashboardCurrencyTabs
            currencies={availableCurrencies}
            selectedCurrency={activeCurrency}
            onSelect={setSelectedCurrency}
          />

          {activeCurrency && (
            <>
              <View style={styles.cardsRow}>
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
            </>
          )}
        </>
      )}

      <Button
        title="New Invoice"
        onPress={() => router.push(ROUTES.invoices.create)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
  },
  emptyState: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
  },
});
