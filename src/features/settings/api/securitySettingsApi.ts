import { Platform } from "react-native";

import { api } from "@/src/shared/api/client";
import { AUTH_ENDPOINTS } from "@/src/shared/api/endpoints";
import { getRefreshToken } from "@/src/shared/utils/tokenStorage";

import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/securitySettingsTypes";

export async function changePasswordApi(
  payload: ChangePasswordRequest,
): Promise<ChangePasswordResponse> {
  const requestBody: ChangePasswordRequest & { refresh?: string } = {
    ...payload,
  };

  if (Platform.OS !== "web") {
    const refresh = await getRefreshToken();

    if (refresh) {
      requestBody.refresh = refresh;
    }
  }

  const response = await api.post<ChangePasswordResponse>(
    AUTH_ENDPOINTS.changePassword,
    requestBody,
  );

  return response.data;
}
