import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteInvoiceApi } from "../api/invoicesApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteInvoiceApi(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.invoiceDetail(id),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoiceDashboard });
    },
  });
}
