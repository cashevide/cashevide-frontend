import { SegmentedTabs } from "@/src/shared/ui";

type DashboardCurrencyTabsProps = {
  currencies: string[];
  selectedCurrency: string | null;
  onSelect: (currency: string) => void;
};

export default function DashboardCurrencyTabs({
  currencies,
  selectedCurrency,
  onSelect,
}: DashboardCurrencyTabsProps) {
  if (currencies.length === 0) {
    return null;
  }

  const activeCurrency = selectedCurrency ?? currencies[0];
  const items = currencies.map((currency) => ({
    key: currency,
    label: currency,
  }));

  return (
    <SegmentedTabs
      items={items}
      activeKey={activeCurrency}
      onSelect={onSelect}
    />
  );
}
