import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { useAuthStore } from "@/src/store/authStore";

import { loginApi } from "../api/loginApi";
import type { LoginRequest, LoginResponse } from "../types/authTypes";

type LoginFormValues = Omit<LoginRequest, "platform">;

export function useLogin() {
  const router = useRouter();

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation<LoginResponse, Error, LoginFormValues>({
    mutationFn: loginApi,

    onSuccess: () => {
      setAuthenticated(true);
      router.replace("/reviews");
    },
  });
}
