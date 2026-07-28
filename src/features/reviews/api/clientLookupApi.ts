import { api } from "@/src/shared/api/client";
import { REVIEWS_ENDPOINTS } from "@/src/shared/api/endpoints";
import type {
  ClientLookupRequest,
  ClientLookupSuccessResponse,
} from "../types/clientTypes";

export async function clientLookupApi(
  payload: ClientLookupRequest,
): Promise<ClientLookupSuccessResponse> {
  const response = await api.post<ClientLookupSuccessResponse>(
    REVIEWS_ENDPOINTS.clientLookup,
    payload,
  );
  return response.data;
}
