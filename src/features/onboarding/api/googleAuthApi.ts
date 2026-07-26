import { Platform } from "react-native";

import { api } from "@/src/shared/api/client";
import { AUTH_ENDPOINTS } from "@/src/shared/api/endpoints";
import { saveTokens } from "@/src/shared/utils/tokenStorage";

import type {
  GoogleAuthRequest,
  GoogleAuthResponse,
} from "../types/googleAuthTypes";

export async function googleAuthApi(
  payload: Omit<GoogleAuthRequest, "platform">,
): Promise<GoogleAuthResponse> {
  const platform = Platform.OS === "web" ? "web" : "mobile";

  const response = await api.post<GoogleAuthResponse>(AUTH_ENDPOINTS.google, {
    ...payload,
    platform,
  });

  if (
    platform === "mobile" &&
    "access" in response.data &&
    "refresh" in response.data &&
    response.data.access &&
    response.data.refresh
  ) {
    await saveTokens({
      access: response.data.access,
      refresh: response.data.refresh,
    });
  }

  return response.data;
}
