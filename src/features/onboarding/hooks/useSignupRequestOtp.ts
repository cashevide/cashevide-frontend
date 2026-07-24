import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { signupRequestOtpApi } from "../api/signupOtpApi";
import { useSignupStore } from "@/src/store/signupStore";
import { ROUTES } from "@/src/shared/navigation/routes";

import type {
  SignupRequestOtpRequest,
  SignupRequestOtpResponse,
} from "../types/signupTypes";

const RESEND_COOLDOWN_MS = 60 * 1000;

type UseSignupRequestOtpOptions = {
  navigateOnSuccess?: boolean;
};

export function useSignupRequestOtp(options: UseSignupRequestOtpOptions = {}) {
  const { navigateOnSuccess = true } = options;

  const router = useRouter();

  const setEmail = useSignupStore((state) => state.setEmail);
  const setOtpCooldownUntil = useSignupStore(
    (state) => state.setOtpCooldownUntil,
  );

  return useMutation<SignupRequestOtpResponse, Error, SignupRequestOtpRequest>({
    mutationFn: signupRequestOtpApi,
    onSuccess: (_data, variables) => {
      setEmail(variables.email);
      setOtpCooldownUntil(Date.now() + RESEND_COOLDOWN_MS);

      if (navigateOnSuccess) {
        router.push(ROUTES.signup.otp);
      }
    },
  });
}
