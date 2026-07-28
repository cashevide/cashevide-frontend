import { api } from "@/src/shared/api/client";
import { REVIEWS_ENDPOINTS } from "@/src/shared/api/endpoints";
import type {
  CreateReviewedClientRequest,
  CreateReviewedClientResponse,
} from "../types/clientTypes";

export async function createReviewedClientApi(
  payload: CreateReviewedClientRequest,
): Promise<CreateReviewedClientResponse> {
  const response = await api.post<CreateReviewedClientResponse>(
    REVIEWS_ENDPOINTS.reviewedClients,
    payload,
  );
  return response.data;
}
