import { Platform } from "react-native";

import { api } from "@/src/shared/api/client";
import { AUTH_ENDPOINTS } from "@/src/shared/api/endpoints";
import { getRefreshToken, saveTokens } from "@/src/shared/utils/tokenStorage";

import type {
  TokenRefreshRequest,
  TokenRefreshResponse,
} from "../types/tokenTypes";

export async function refreshTokenApi(): Promise<TokenRefreshResponse> {
  const platform = Platform.OS === "web" ? "web" : "mobile";

  let payload: TokenRefreshRequest = {
    platform,
  };

  if (platform === "mobile") {
    const refresh = await getRefreshToken();

    if (!refresh) {
      throw new Error("Refresh token is missing");
    }

    payload = {
      platform,
      refresh,
    };
  }

  const response = await api.post<TokenRefreshResponse>(
    AUTH_ENDPOINTS.refresh,
    payload,
  );

  if (platform === "mobile" && response.data.access && response.data.refresh) {
    await saveTokens({
      access: response.data.access,
      refresh: response.data.refresh,
    });
  }

  return response.data;
}
