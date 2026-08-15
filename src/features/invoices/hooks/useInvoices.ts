import { useInfiniteQuery } from "@tanstack/react-query";

import { getInvoicesApi } from "../api/invoicesApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";

import type { GetInvoicesParams } from "../api/invoicesApi";
import type { InvoicesListResponse } from "../types/invoiceTypes";

// Extracts the `page` query param from a DRF-style `next` URL
// ("https://api.example.com/invoices/?page=2&search=..."). Returns
// undefined once `next` is null (no more pages) or the param is missing,
// which tells useInfiniteQuery to stop requesting further pages.
//
// Deliberately a plain regex rather than the URL/URLSearchParams API —
// React Native's built-in URL polyfill has documented reliability issues
// on native (e.g. facebook/react-native#38656, "searchParams.get is not
// implemented"), and adding react-native-url-polyfill as a dependency
// for one query-param extraction is more than this needs.
function getPageFromUrl(url: string | null): number | undefined {
  if (!url) return undefined;

  const match = url.match(/[?&]page=(\d+)/);
  return match ? Number(match[1]) : undefined;
}

export function useInvoices(params?: GetInvoicesParams) {
  return useInfiniteQuery<InvoicesListResponse, Error>({
    queryKey: QUERY_KEYS.invoices(params),
    queryFn: ({ pageParam }) =>
      getInvoicesApi({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => getPageFromUrl(lastPage.next),
  });
}
