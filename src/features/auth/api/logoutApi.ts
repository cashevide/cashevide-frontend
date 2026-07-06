import { Platform } from "react-native";

import { api } from "@/src/shared/api/client";
import { AUTH_ENDPOINTS } from "@/src/shared/api/endpoints";
import { getRefreshToken } from "@/src/shared/utils/tokenStorage";

import type { LogoutRequest, LogoutResponse } from "../types/logoutTypes";

export async function logoutApi(): Promise<LogoutResponse> {
  let payload: LogoutRequest = {};

  if (Platform.OS !== "web") {
    const refresh = await getRefreshToken();

    if (!refresh) {
      throw new Error("Refresh token is missing");
    }

    payload = {
      refresh,
    };
  }

  const response = await api.post<LogoutResponse>(
    AUTH_ENDPOINTS.logout,
    payload,
  );

  return response.data;
}
