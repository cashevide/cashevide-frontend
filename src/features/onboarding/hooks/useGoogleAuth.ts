import { useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { googleAuthApi } from "../api/googleAuthApi";
import { useAuthStore } from "@/src/store/authStore";
import { useGoogleAuthStore } from "@/src/store/googleAuthStore";
import { env } from "@/src/config/env";
import { ROUTES } from "@/src/shared/navigation/routes";

import type {
  GoogleAuthRequest,
  GoogleAuthResponse,
} from "../types/googleAuthTypes";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri();

type GoogleAuthMutationPayload = Omit<GoogleAuthRequest, "platform">;

type UseGoogleAuthOptions = {
  onBeforeNavigate?: () => void;
};

export function useGoogleAuth(options: UseGoogleAuthOptions = {}) {
  const { onBeforeNavigate } = options;

  const router = useRouter();

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  const setGoogleIdToken = useGoogleAuthStore(
    (state) => state.setGoogleIdToken,
  );
  const setProfileInfo = useGoogleAuthStore((state) => state.setProfileInfo);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: env.googleWebClientId,
    androidClientId: env.googleAndroidClientId,
    iosClientId: env.googleIosClientId,
    redirectUri,
  });

  const googleAuthMutation = useMutation<
    GoogleAuthResponse,
    Error,
    GoogleAuthMutationPayload
  >({
    mutationFn: (payload) => googleAuthApi(payload),
    onSuccess: (data) => {
      onBeforeNavigate?.();

      if ("status" in data && data.status === "prompt_referral") {
        setProfileInfo(data.email, data.full_name);
        router.push(ROUTES.signup.google.referral);

        return;
      }

      setAuthenticated(true);
      router.replace(ROUTES.reviews.home);
    },
  });

  useEffect(() => {
    if (response?.type === "success" && response.params.id_token) {
      const idToken = response.params.id_token;

      setGoogleIdToken(idToken);
      googleAuthMutation.mutate({ google_id_token: idToken });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return {
    request,
    promptAsync,
    submitGoogleSignup: googleAuthMutation.mutate,
    isPending: googleAuthMutation.isPending,
    error: googleAuthMutation.error,
  };
}
