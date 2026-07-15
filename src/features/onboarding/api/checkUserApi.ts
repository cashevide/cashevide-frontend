import { api } from "@/src/shared/api/client";
import { AUTH_ENDPOINTS } from "@/src/shared/api/endpoints";

import type {
  CheckUserRequest,
  CheckUserResponse,
} from "../types/availabilityTypes";

export async function checkUserApi(
  params: CheckUserRequest,
): Promise<CheckUserResponse> {
  const response = await api.get<CheckUserResponse>(AUTH_ENDPOINTS.checkUser, {
    params,
  });

  return response.data;
}
