import { useCallback, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { useInvoiceDashboard } from "../hooks/useInvoiceDashboard";
import { useBusinessProfile } from "@/src/features/business-profile/hooks/useBusinessProfile";
import { ROUTES } from "@/src/shared/navigation/routes";
import { getAvailableCurrencies } from "../utils/invoiceDashboardUtils";
import InvoiceSubTabs from "../components/InvoiceSubTabs";
import DashboardCurrencyTabs from "../components/DashboardCurrencyTabs";
import DashboardReceivedCard from "../components/DashboardReceivedCard";
import DashboardBalanceDueCard from "../components/DashboardBalanceDueCard";
import DashboardSummaryCard from "../components/DashboardSummaryCard";
import { Container } from "@/src/shared/layout/Container";
import { ScreenHeader } from "@/src/shared/layout/ScreenHeader";
import { Text, Button, Logo, InfoDialog, Spinner } from "@/src/shared/ui";

import type { InvoiceDashboardResponse } from "../types/invoiceDashboardTypes";

// Logo takes width as a numeric SVG prop, not className, so the web/
// native size difference has to be a platform check rather than a
// NativeWind web: class — same reasoning as ScreenHeader's back icon.
const LOGO_WIDTH = Platform.OS === "web" ? 40 : 28;

export default function InvoiceDashboardScreen() {
  const dashboard = useInvoiceDashboard();
  const businessProfile = useBusinessProfile();
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dashboard.refetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader containerVariant="desktop">
        <View className="flex-row items-center justify-between">
          <Logo width={LOGO_WIDTH} />

          {/* Placeholder — real credit-points value/description to
              follow once the credit-points API/design is finalized. */}
          <Pressable
            onPress={() => setIsCreditModalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-secondary"
          >
            <Text variant="body-sm">Credits</Text>
          </Pressable>
        </View>
      </ScreenHeader>

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
              preferredCurrency={businessProfile.data?.currency}
            />
          )}
        </View>
      </Container>

      <InfoDialog
        visible={isCreditModalOpen}
        onDismiss={() => setIsCreditModalOpen(false)}
        title="Credit points"
        message="Your credit-points details will show up here soon."
      />
    </View>
  );
}

function DashboardContent({
  data,
  selectedCurrency,
  onSelectCurrency,
  preferredCurrency,
}: {
  data: InvoiceDashboardResponse;
  selectedCurrency: string | null;
  onSelectCurrency: (currency: string) => void;
  preferredCurrency?: string | null;
}) {
  const { revenue, balance_due } = data;
  const availableCurrencies = getAvailableCurrencies(
    [revenue.total, balance_due.total],
    preferredCurrency,
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
        <View className="gap-3 web:flex-row web:items-stretch">
          <View className="flex-row gap-3 web:flex-col web:flex-1 web:gap-3 web:self-start">
            <DashboardReceivedCard
              totalRevenue={revenue.total}
              currency={activeCurrency}
            />
            <DashboardBalanceDueCard
              totalBalanceDue={balance_due.total}
              currency={activeCurrency}
            />
          </View>

          <View className="web:flex-[3]">
            <DashboardSummaryCard
              thisMonth={revenue.this_month}
              lastMonth={revenue.last_month}
              lastThreeMonths={revenue.last_three_months}
              thisYear={revenue.this_year}
              lastYear={revenue.last_year}
              currency={activeCurrency}
            />
          </View>
        </View>
      )}
    </>
  );
}
