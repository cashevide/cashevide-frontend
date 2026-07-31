import { useMutation } from "@tanstack/react-query";

import { downloadInvoicePdfApi } from "../api/invoicePdfApi";

export function useDownloadInvoicePdf() {
  return useMutation<void, Error, number>({
    mutationFn: (id) => downloadInvoicePdfApi(id),
  });
}
