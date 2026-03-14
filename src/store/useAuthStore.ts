import { create } from "zustand";
import { getToken, setToken, deleteToken } from "../utils/tokenStorage";
import { loginUser, registerUser, logoutUser } from "../api/auth";
import { Platform } from "react-native";
import { api } from "../api/axios";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    username: string,
    password: string,
    full_name: string,
    referralCode: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  checkLoginStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginUser(email, password);

      if (data && data.access) {
        await setToken("access_token", data.access);
        await setToken("refresh_token", data.refresh);
      }

      set({ isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error(error);
      set({
        error: "Login Failed! Check email/password.",
        isLoading: false,
      });
    }
  },


  signup: async (email, username, password, full_name, referralCodeInput) => {
    set({ isLoading: true, error: null });
    try {
      const data = await registerUser(email, username, password, full_name, referralCodeInput);

      if (data && data.access) {
        await setToken("access_token", data.access);
        await setToken("refresh_token", data.refresh);
      }

      set({ isAuthenticated: true, isLoading: false });
      return true;

    } catch (error) {
      console.error(error);
      set({
        error: "Signup Failed! Please check your details.",
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      await deleteToken("access_token");
      await deleteToken("refresh_token");
      set({ isAuthenticated: false });
    }
  },

  checkLoginStatus: async () => {
    const isWeb = Platform.OS === 'web';

    if (!isWeb) {
      const token = await getToken("access_token");
      if (token) {
        set({ isAuthenticated: true });
      } else {
        set({ isAuthenticated: false });
      }
    }
    else {
      try {
        await api.get('users/profile/me/')
        set({ isAuthenticated: true });
      }
      catch {
        set({ isAuthenticated: false })
      }
    }

  },
}));
