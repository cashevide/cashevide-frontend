import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { Platform } from "react-native";

import { env } from "@/src/config/env";
import { useAuthStore } from "@/src/store/authStore";
import { AUTH_ENDPOINTS } from "@/src/shared/api/endpoints";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "@/src/shared/utils/tokenStorage";

import type { TokenRefreshResponse } from "@/src/features/auth/types/tokenTypes";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

// When several requests hit a 401 at the same moment (e.g. multiple
// queries refetching together on window focus), each would otherwise
// fire its own /auth/refresh call. With refresh token rotation on the
// backend, only the first of those calls succeeds — every other one
// is sent with a refresh token that's already been invalidated by the
// first, fails, and (incorrectly) logs the user out even though their
// session is still valid. Sharing a single in-flight promise across
// concurrent 401s ensures only one refresh call is ever made per
// expiry; every other request awaits and reuses its result.
let refreshPromise: Promise<TokenRefreshResponse> | null = null;

async function performRefresh(): Promise<TokenRefreshResponse> {
  const platform = Platform.OS === "web" ? "web" : "mobile";

  const payload: {
    platform: "web" | "mobile";
    refresh?: string;
  } = {
    platform,
  };

  if (platform === "mobile") {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      throw new Error("Refresh token is missing");
    }

    payload.refresh = refreshToken;
  }

  const refreshResponse = await axios.post<TokenRefreshResponse>(
    `${env.apiUrl}${AUTH_ENDPOINTS.refresh}`,
    payload,
    {
      withCredentials: true,
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (
    platform === "mobile" &&
    refreshResponse.data.access &&
    refreshResponse.data.refresh
  ) {
    await saveTokens({
      access: refreshResponse.data.access,
      refresh: refreshResponse.data.refresh,
    });
  }

  return refreshResponse.data;
}

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 30000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  if (Platform.OS === "web") {
    return config;
  }

  const accessToken = await getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Start a refresh only if one isn't already in flight; every
      // concurrent 401 piggybacks on that same promise. The `finally`
      // clears it once settled so the next genuine expiry starts a
      // fresh refresh.
      if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
          refreshPromise = null;
        });
      }

      const refreshData = await refreshPromise;

      if (Platform.OS !== "web" && refreshData.access) {
        originalRequest.headers.Authorization = `Bearer ${refreshData.access}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      await clearTokens();

      useAuthStore.getState().resetAuth();

      return Promise.reject(refreshError);
    }
  },
);
