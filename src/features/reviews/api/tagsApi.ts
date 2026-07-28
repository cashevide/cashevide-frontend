import { api } from "@/src/shared/api/client";
import { REVIEWS_ENDPOINTS } from "@/src/shared/api/endpoints";
import type { TagListResponse } from "../types/tagTypes";

export async function getTagsApi(): Promise<TagListResponse> {
  const response = await api.get<TagListResponse>(REVIEWS_ENDPOINTS.tags);
  return response.data;
}
