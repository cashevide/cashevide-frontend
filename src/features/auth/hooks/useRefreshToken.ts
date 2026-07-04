import { useMutation } from "@tanstack/react-query";

import { refreshTokenApi } from "../api/tokenApi";
import type { TokenRefreshResponse } from "../types/tokenTypes";

export function useRefreshToken() {
  return useMutation<TokenRefreshResponse, Error, void>({
    mutationFn: refreshTokenApi,
  });
}
