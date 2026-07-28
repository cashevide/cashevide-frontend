import { api } from "@/src/shared/api/client";
import { REVIEWS_ENDPOINTS } from "@/src/shared/api/endpoints";
import type { ReviewSummaryResponse } from "../types/reviewSummaryTypes";

export async function getReviewSummaryApi(
  clientId: string,
): Promise<ReviewSummaryResponse> {
  const response = await api.get<ReviewSummaryResponse>(
    REVIEWS_ENDPOINTS.clientReviewSummary(clientId),
  );
  return response.data;
}
