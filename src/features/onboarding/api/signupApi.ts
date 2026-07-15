import { Platform } from "react-native";

import { api } from "@/src/shared/api/client";
import { AUTH_ENDPOINTS } from "@/src/shared/api/endpoints";
import { saveTokens } from "@/src/shared/utils/tokenStorage";

import type { SignupRequest, SignupResponse } from "../types/signupTypes";

export async function signupApi(
  payload: Omit<SignupRequest, "platform">,
): Promise<SignupResponse> {
  const platform = Platform.OS === "web" ? "web" : "mobile";

  const response = await api.post<SignupResponse>(AUTH_ENDPOINTS.signup, {
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
