import type { CurrencyAmountMap } from "../types/invoiceDashboardTypes";

// Returns the sorted list of currency codes present across the revenue and
// balance-due buckets combined — used to drive the currency-tab selector.
// A currency only needs to appear in ONE bucket to show up as a tab.
export function getAvailableCurrencies(
  ...buckets: CurrencyAmountMap[]
): string[] {
  const currencySet = new Set<string>();

  for (const bucket of buckets) {
    for (const currency of Object.keys(bucket)) {
      currencySet.add(currency);
    }
  }

  return Array.from(currencySet).sort();
}

// Safely reads an amount for a currency out of a bucket — missing means no
// data for that currency in that time window, not zero, but 0 is the
// correct display fallback.
export function getAmountForCurrency(
  bucket: CurrencyAmountMap,
  currency: string,
): number {
  return bucket[currency] ?? 0;
}

export function isBucketEmpty(bucket: CurrencyAmountMap): boolean {
  return Object.keys(bucket).length === 0;
}

// Formats a plain number amount with the currency code prefixed — the
// dashboard-analytics endpoint returns numbers, not decimal strings (unlike
// Invoice's money fields), so this takes a number, not a string.
export function formatDashboardAmount(
  amount: number,
  currency: string,
): string {
  return `${currency} ${amount.toLocaleString()}`;
}
