import { Platform } from "react-native";
import { api } from "./axios";
import { getToken } from "../utils/tokenStorage";

const platform = Platform.OS === "web" ? "web" : "mobile";

export const loginUser = async (email: string, password: string,) => {
  try {
    const response = await api.post("users/login/", {
      email,
      password,
      platform,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestSignupOtp = async (email: string) => {
  try {
    const response = await api.post('users/signup-request-otp/', { email })
    return response.data;

  } catch (error) {
    throw error;
  }
};

export const verifySignupOtp = async (email: string, otp: string) => {
  try {
    const response = await api.post('users/signup-verify-otp/', { email, otp });
    return response.data
  } catch (error) {
    throw error;
  }
};

export const checkUsernameAvailability = async (username: string) => {
  try {

    const response = await api.get(`users/check-user/?field=username&value=${username}`);
    return response.data.is_available

  } catch (error) {
    throw error;
  }
};

export const registerUser = async (
  email: string,
  username: string,
  password: string,
  full_name: string,
  referralCodeInput: string
) => {
  try {
    const response = await api.post("users/signup/", {
      email,
      username,
      password,
      full_name,
      referral_code_input: referralCodeInput,
      platform,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const isWeb = Platform.OS === "web";
    let payload = {};

    if (!isWeb) {
      const refresh = await getToken("refresh_token");
      payload = { refresh };
    }

    const response = await api.post("users/logout/", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
