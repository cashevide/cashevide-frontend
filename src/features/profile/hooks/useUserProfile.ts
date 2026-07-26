import { useQuery } from "@tanstack/react-query";

import { getUserProfileApi } from "../api/userProfileApi";

import type { UserProfile } from "../types/userProfileTypes";

export function useUserProfile(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;

  return useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: getUserProfileApi,
    enabled,
  });
}
