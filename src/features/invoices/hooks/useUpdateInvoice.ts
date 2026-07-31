import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateInvoiceApi } from "../api/invoicesApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";

import type {
  UpdateInvoiceRequest,
  UpdateInvoiceResponse,
} from "../types/invoiceTypes";

type UpdateInvoiceVariables = {
  id: number;
  payload: UpdateInvoiceRequest;
};

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation<UpdateInvoiceResponse, Error, UpdateInvoiceVariables>({
    mutationFn: ({ id, payload }) => updateInvoiceApi(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.invoiceDetail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoiceDashboard });
    },
  });
}
