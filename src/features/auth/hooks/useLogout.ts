import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { clearTokens } from "@/src/shared/utils/tokenStorage";
import { useAuthStore } from "@/src/store/authStore";

import { logoutApi } from "../api/logoutApi";
import type { LogoutResponse } from "../types/logoutTypes";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const resetAuth = useAuthStore((state) => state.resetAuth);

  return useMutation<LogoutResponse, Error, void>({
    mutationFn: logoutApi,

    onSettled: async () => {
      await clearTokens();

      queryClient.clear();
      resetAuth();

      router.replace("/login");
    },
  });
}
