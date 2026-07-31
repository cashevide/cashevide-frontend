import { useQuery } from "@tanstack/react-query";

import { getInvoicesApi } from "../api/invoicesApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";

import type { GetInvoicesParams } from "../api/invoicesApi";
import type { InvoicesListResponse } from "../types/invoiceTypes";

export function useInvoices(params?: GetInvoicesParams) {
  return useQuery<InvoicesListResponse, Error>({
    queryKey: QUERY_KEYS.invoices(params),
    queryFn: () => getInvoicesApi(params),
  });
}
