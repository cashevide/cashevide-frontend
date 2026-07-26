import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { resetPasswordApi } from "../api/passwordResetApi";
import { usePasswordResetStore } from "@/src/store/passwordResetStore";
import { ROUTES } from "@/src/shared/navigation/routes";

import type {
  ResetPasswordRequest,
  ResetPasswordSuccessResponse,
} from "../types/passwordResetTypes";

export function useResetPassword() {
  const router = useRouter();

  const resetPasswordResetFlow = usePasswordResetStore(
    (state) => state.resetPasswordResetFlow,
  );

  return useMutation<ResetPasswordSuccessResponse, Error, ResetPasswordRequest>(
    {
      mutationFn: resetPasswordApi,
      onSuccess: () => {
        resetPasswordResetFlow();
        router.replace(ROUTES.login);
      },
    },
  );
}
