import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { passwordResetRequestOtpApi } from "../api/passwordResetApi";
import { usePasswordResetStore } from "@/src/store/passwordResetStore";
import { ROUTES } from "@/src/shared/navigation/routes";

import type {
  PasswordResetRequestOtpRequest,
  PasswordResetRequestOtpResponse,
} from "../types/passwordResetTypes";

const RESEND_COOLDOWN_MS = 60 * 1000;

type UseRequestPasswordResetOtpOptions = {
  navigateOnSuccess?: boolean;
};

export function useRequestPasswordResetOtp(
  options: UseRequestPasswordResetOtpOptions = {},
) {
  const { navigateOnSuccess = true } = options;

  const router = useRouter();

  const setEmail = usePasswordResetStore((state) => state.setEmail);
  const setOtpCooldownUntil = usePasswordResetStore(
    (state) => state.setOtpCooldownUntil,
  );

  return useMutation<
    PasswordResetRequestOtpResponse,
    Error,
    PasswordResetRequestOtpRequest
  >({
    mutationFn: passwordResetRequestOtpApi,
    onSuccess: (_data, variables) => {
      setEmail(variables.email);
      setOtpCooldownUntil(Date.now() + RESEND_COOLDOWN_MS);

      if (navigateOnSuccess) {
        router.push(ROUTES.passwordReset.otp);
      }
    },
  });
}
