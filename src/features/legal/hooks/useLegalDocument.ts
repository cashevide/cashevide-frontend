import { useQuery } from "@tanstack/react-query";

import { getLegalDocumentApi } from "../api/legalDocumentsApi";

import type { LegalDocument } from "../types/legalTypes";

export function useLegalDocument(docType: string) {
  return useQuery<LegalDocument, Error>({
    queryKey: ["legalDocument", docType],
    queryFn: () => getLegalDocumentApi(docType),
    enabled: docType.length > 0,
  });
}
