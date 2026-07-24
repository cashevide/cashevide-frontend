import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { signupVerifyOtpApi } from "../api/signupOtpApi";
import { useSignupStore } from "@/src/store/signupStore";
import { ROUTES } from "@/src/shared/navigation/routes";

import type {
  SignupVerifyOtpRequest,
  SignupVerifyOtpResponse,
} from "../types/signupTypes";

export function useSignupVerifyOtp() {
  const router = useRouter();

  const setEmailOtpVerified = useSignupStore(
    (state) => state.setEmailOtpVerified,
  );

  return useMutation<SignupVerifyOtpResponse, Error, SignupVerifyOtpRequest>({
    mutationFn: signupVerifyOtpApi,
    onSuccess: () => {
      setEmailOtpVerified(true);
      router.push(ROUTES.signup.account);
    },
  });
}
