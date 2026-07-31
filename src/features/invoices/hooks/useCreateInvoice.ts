import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createInvoiceApi } from "../api/invoicesApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";

import type {
  CreateInvoiceRequest,
  CreateInvoiceResponse,
} from "../types/invoiceTypes";

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation<CreateInvoiceResponse, Error, CreateInvoiceRequest>({
    mutationFn: createInvoiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoiceDashboard });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userProfile });
    },
  });
}
