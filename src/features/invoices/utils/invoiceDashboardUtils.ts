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

// Same formatting, split into parts — for hero-amount displays (the two
// stat cards). INR/USD show their symbol (the two currencies most
// Cashevide users deal with day to day); everything else falls back to
// the plain ISO code, same as before.
//
// isSymbol tells the caller how to render the two parts: a currency
// SYMBOL sits directly against the number at the same size with no gap
// ($1,000 — the standard typographic convention), while an ISO CODE (no
// symbol available) reads as a separate, smaller label before the
// amount (AED 1,000) since it's a multi-letter abbreviation, not a
// single glyph meant to look "attached" to the number.
const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
};

export function formatDashboardAmountParts(
  amount: number,
  currency: string,
): { currency: string; value: string; isSymbol: boolean } {
  const symbol = CURRENCY_SYMBOLS[currency];

  return {
    currency: symbol ?? currency,
    value: amount.toLocaleString(),
    isSymbol: symbol != null,
  };
}
