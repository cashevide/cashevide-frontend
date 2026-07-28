import { api } from "@/src/shared/api/client";
import { REVIEWS_ENDPOINTS } from "@/src/shared/api/endpoints";
import type {
  CreateReviewRequest,
  CreateReviewResponse,
  MyReviewForClientResponse,
} from "../types/reviewTypes";

export async function createReviewApi(
  clientId: string,
  payload: CreateReviewRequest,
): Promise<CreateReviewResponse> {
  const response = await api.post<CreateReviewResponse>(
    REVIEWS_ENDPOINTS.clientReviews(clientId),
    payload,
  );
  return response.data;
}

export async function getMyReviewForClientApi(
  clientId: string,
): Promise<MyReviewForClientResponse> {
  const response = await api.get<MyReviewForClientResponse>(
    REVIEWS_ENDPOINTS.clientMyReview(clientId),
  );
  return response.data;
}
