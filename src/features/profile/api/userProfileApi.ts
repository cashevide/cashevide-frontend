import { api } from "@/src/shared/api/client";
import { AUTH_ENDPOINTS } from "@/src/shared/api/endpoints";

import type { UserProfile } from "../types/userProfileTypes";

export async function getUserProfileApi(): Promise<UserProfile> {
  const response = await api.get<UserProfile>(AUTH_ENDPOINTS.profile);

  return response.data;
}
