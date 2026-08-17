import { Platform } from "react-native";
import { api } from "@/src/shared/api/client";
import { AUTH_ENDPOINTS } from "@/src/shared/api/endpoints";

import type { UserProfile } from "../types/userProfileTypes";

export async function getUserProfileApi(): Promise<UserProfile> {
  const response = await api.get<UserProfile>(AUTH_ENDPOINTS.profile);

  return response.data;
}

export type UpdateUserProfileRequest = {
  full_name?: string;
  phone_number?: string;
  job_title?: string;
  // undefined: leave the picture unchanged (field omitted from the
  // request entirely).
  // { uri, name, type }: upload this as the new picture.
  // null: remove the existing picture — sent to the backend as an
  // empty string, which DRF's ImageField (null=True, blank=True on
  // the model) treats as "clear this field".
  profile_picture?: {
    uri: string;
    name: string;
    type: string;
  } | null;
};

async function appendProfilePicture(
  formData: FormData,
  profilePicture: { uri: string; name: string; type: string },
) {
  if (Platform.OS === "web") {
    const response = await fetch(profilePicture.uri);
    const blob = await response.blob();
    formData.append("profile_picture", blob, profilePicture.name);
    return;
  }

  formData.append("profile_picture", {
    uri: profilePicture.uri,
    name: profilePicture.name,
    type: profilePicture.type,
  } as unknown as Blob);
}

export async function updateUserProfileApi(
  payload: UpdateUserProfileRequest,
): Promise<UserProfile> {
  const formData = new FormData();

  if (payload.full_name !== undefined) {
    formData.append("full_name", payload.full_name);
  }
  if (payload.phone_number !== undefined) {
    formData.append("phone_number", payload.phone_number);
  }
  if (payload.job_title !== undefined) {
    formData.append("job_title", payload.job_title);
  }
  if (payload.profile_picture === null) {
    formData.append("profile_picture", "");
  } else if (payload.profile_picture) {
    await appendProfilePicture(formData, payload.profile_picture);
  }

  const response = await api.patch<UserProfile>(
    AUTH_ENDPOINTS.profile,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return response.data;
}
