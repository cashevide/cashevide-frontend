import { useInfiniteQuery } from "@tanstack/react-query";

import { getInvoicesApi } from "../api/invoicesApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";
import { getPageFromUrl } from "@/src/shared/api/pagination";

import type { GetInvoicesParams } from "../api/invoicesApi";
import type { InvoicesListResponse } from "../types/invoiceTypes";

export function useInvoices(params?: GetInvoicesParams) {
  return useInfiniteQuery<InvoicesListResponse, Error>({
    queryKey: QUERY_KEYS.invoices(params),
    queryFn: ({ pageParam }) =>
      getInvoicesApi({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => getPageFromUrl(lastPage.next),
  });
}
