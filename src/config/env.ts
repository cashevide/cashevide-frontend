const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("EXPO_PUBLIC_API_URL is missing");
}

const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

if (!googleWebClientId) {
  throw new Error("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is missing");
}

const googleAndroidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

if (!googleAndroidClientId) {
  throw new Error("EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID is missing");
}

const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

if (!googleIosClientId) {
  throw new Error("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID is missing");
}

export const env = {
  apiUrl,
  googleWebClientId,
  googleAndroidClientId,
  googleIosClientId,
};
