import { api } from "@/src/shared/api/client";
import { LEGAL_ENDPOINTS } from "@/src/shared/api/endpoints";

import type { LegalDocument } from "../types/legalTypes";

export async function getLegalDocumentApi(
  docType: string,
): Promise<LegalDocument> {
  const response = await api.get<LegalDocument>(
    LEGAL_ENDPOINTS.document(docType),
  );

  return response.data;
}
