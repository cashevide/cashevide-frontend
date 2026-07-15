import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { signupApi } from "../api/signupApi";
import { useAuthStore } from "@/src/store/authStore";
import { useSignupStore } from "@/src/store/signupStore";

import type { SignupRequest, SignupResponse } from "../types/signupTypes";

type SignupFormValues = Omit<SignupRequest, "platform">;

export function useSignup() {
  const router = useRouter();

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const resetSignup = useSignupStore((state) => state.resetSignup);

  return useMutation<SignupResponse, Error, SignupFormValues>({
    mutationFn: signupApi,
    onSuccess: () => {
      setAuthenticated(true);
      resetSignup();
      router.replace("/reviews");
    },
  });
}
