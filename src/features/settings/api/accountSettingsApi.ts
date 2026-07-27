import { Platform } from "react-native";

import { api } from "@/src/shared/api/client";
import { AUTH_ENDPOINTS } from "@/src/shared/api/endpoints";
import { getRefreshToken } from "@/src/shared/utils/tokenStorage";

import type { DeleteAccountResponse } from "../types/accountSettingsTypes";

export async function deleteAccountApi(): Promise<DeleteAccountResponse> {
  const requestBody: { refresh?: string } = {};

  if (Platform.OS !== "web") {
    const refresh = await getRefreshToken();

    if (refresh) {
      requestBody.refresh = refresh;
    }
  }

  const response = await api.delete<DeleteAccountResponse>(
    AUTH_ENDPOINTS.deleteAccount,
    { data: requestBody },
  );

  return response.data;
}
