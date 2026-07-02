import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "cashevide_access_token";
const REFRESH_TOKEN_KEY = "cashevide_refresh_token";

export async function saveTokens(tokens: { access: string; refresh: string }) {
  if (Platform.OS === "web") return;

  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.access);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refresh);
}

export async function getAccessToken() {
  if (Platform.OS === "web") return null;

  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
  if (Platform.OS === "web") return null;

  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function clearTokens() {
  if (Platform.OS === "web") return;

  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}
