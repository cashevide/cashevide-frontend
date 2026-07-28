import { api } from "@/src/shared/api/client";
import { REVIEWS_ENDPOINTS } from "@/src/shared/api/endpoints";
import type {
  MyReviewsListResponse,
  MyReviewDetailResponse,
  UpdateMyReviewRequest,
  UpdateMyReviewResponse,
} from "../types/reviewTypes";

export async function getMyReviewsApi(): Promise<MyReviewsListResponse> {
  const response = await api.get<MyReviewsListResponse>(
    REVIEWS_ENDPOINTS.myReviews,
  );
  return response.data;
}

export async function getMyReviewDetailApi(
  id: number,
): Promise<MyReviewDetailResponse> {
  const response = await api.get<MyReviewDetailResponse>(
    REVIEWS_ENDPOINTS.myReviewDetail(id),
  );
  return response.data;
}

export async function updateMyReviewApi(
  id: number,
  payload: UpdateMyReviewRequest,
): Promise<UpdateMyReviewResponse> {
  const response = await api.patch<UpdateMyReviewResponse>(
    REVIEWS_ENDPOINTS.myReviewDetail(id),
    payload,
  );
  return response.data;
}

export async function deleteMyReviewApi(id: number): Promise<void> {
  await api.delete(REVIEWS_ENDPOINTS.myReviewDetail(id));
}
