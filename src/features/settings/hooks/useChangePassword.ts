import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { changePasswordApi } from "../api/securitySettingsApi";
import { clearTokens } from "@/src/shared/utils/tokenStorage";
import { useAuthStore } from "@/src/store/authStore";
import { ROUTES } from "@/src/shared/navigation/routes";

import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/securitySettingsTypes";

export function useChangePassword() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const resetAuth = useAuthStore((state) => state.resetAuth);

  return useMutation<ChangePasswordResponse, Error, ChangePasswordRequest>({
    mutationFn: changePasswordApi,
    onSuccess: async () => {
      await clearTokens();

      queryClient.clear();
      resetAuth();

      router.replace(ROUTES.login);
    },
  });
}
