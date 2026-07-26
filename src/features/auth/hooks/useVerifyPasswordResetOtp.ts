import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { passwordResetVerifyOtpApi } from "../api/passwordResetApi";
import { usePasswordResetStore } from "@/src/store/passwordResetStore";
import { ROUTES } from "@/src/shared/navigation/routes";

import type {
  PasswordResetVerifyOtpRequest,
  PasswordResetVerifyOtpResponse,
} from "../types/passwordResetTypes";

export function useVerifyPasswordResetOtp() {
  const router = useRouter();

  const setOtpVerified = usePasswordResetStore((state) => state.setOtpVerified);

  return useMutation<
    PasswordResetVerifyOtpResponse,
    Error,
    PasswordResetVerifyOtpRequest
  >({
    mutationFn: passwordResetVerifyOtpApi,
    onSuccess: () => {
      setOtpVerified(true);
      router.push(ROUTES.passwordReset.reset);
    },
  });
}
