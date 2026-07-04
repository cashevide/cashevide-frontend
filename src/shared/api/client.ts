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

        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      await clearTokens();

      useAuthStore.getState().resetAuth();

      return Promise.reject(refreshError);
    }
  },
);
