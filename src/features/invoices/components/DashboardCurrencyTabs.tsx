import { PillTabs } from "@/src/shared/ui";

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

  const items = currencies.map((currency) => ({
    key: currency,
    label: currency,
  }));

  return (
    <PillTabs
      items={items}
      activeKey={selectedCurrency ?? currencies[0]}
      onSelect={onSelect}
    />
  );
}
