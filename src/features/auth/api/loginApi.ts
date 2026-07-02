import { Platform } from "react-native";

import { api } from "@/src/shared/api/client";
import { AUTH_ENDPOINTS } from "@/src/shared/api/endpoints";
import { saveTokens } from "@/src/shared/utils/tokenStorage";

import type { LoginRequest, LoginResponse } from "../types/authTypes";

export async function loginApi(
  payload: Omit<LoginRequest, "platform">,
): Promise<LoginResponse> {
  const platform = Platform.OS === "web" ? "web" : "mobile";

  const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.login, {
    ...payload,
    platform,
  });

  if (platform === "mobile" && response.data.access && response.data.refresh) {
    await saveTokens({
      access: response.data.access,
      refresh: response.data.refresh,
    });
  }

  return response.data;
}
