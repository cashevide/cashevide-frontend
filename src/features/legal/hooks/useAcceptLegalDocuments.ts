import { useMutation, useQueryClient } from "@tanstack/react-query";

import { acceptLegalDocumentsApi } from "../api/legalAcceptanceApi";

import type {
  AcceptLegalDocumentsRequest,
  AcceptLegalDocumentsResponse,
} from "../types/legalTypes";

export function useAcceptLegalDocuments() {
  const queryClient = useQueryClient();

  return useMutation<
    AcceptLegalDocumentsResponse,
    Error,
    AcceptLegalDocumentsRequest
  >({
    mutationFn: acceptLegalDocumentsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
