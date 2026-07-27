import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { deleteAccountApi } from "../api/accountSettingsApi";
import { clearTokens } from "@/src/shared/utils/tokenStorage";
import { useAuthStore } from "@/src/store/authStore";
import { ROUTES } from "@/src/shared/navigation/routes";

import type { DeleteAccountResponse } from "../types/accountSettingsTypes";

export function useDeleteAccount() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const resetAuth = useAuthStore((state) => state.resetAuth);

  return useMutation<DeleteAccountResponse, Error, void>({
    mutationFn: deleteAccountApi,
    onSuccess: async () => {
      await clearTokens();

      queryClient.clear();
      resetAuth();

      router.replace(ROUTES.welcome);
    },
  });
}
