// Extracts the `page` query param from a DRF-style pagination `next` URL
// ("https://api.example.com/invoices/?page=2&search=..."). Returns
// undefined once `next` is null (no more pages) or the param is missing,
// which tells useInfiniteQuery's getNextPageParam to stop requesting
// further pages.
//
// Deliberately a plain regex rather than the URL/URLSearchParams API —
// React Native's built-in URL polyfill has documented reliability issues
// on native (e.g. facebook/react-native#38656, "searchParams.get is not
// implemented"), and adding react-native-url-polyfill as a dependency
// for one query-param extraction is more than this needs.
//
// Shared across every list endpoint using DRF's standard
// {count, next, previous, results} pagination shape (invoices, clients,
// products, and any future list) rather than duplicated per feature.
export function getPageFromUrl(url: string | null): number | undefined {
  if (!url) return undefined;

  const match = url.match(/[?&]page=(\d+)/);
  return match ? Number(match[1]) : undefined;
}
