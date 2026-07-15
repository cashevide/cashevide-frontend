import type {
  LoginPlatform,
  AuthUser,
} from "@/src/features/auth/types/authTypes";

// Generic DRF field-error shape — reused across all signup POST endpoints.
export type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

// -------------------- signup-request-otp --------------------

export type SignupRequestOtpRequest = {
  email: string;
};

export type SignupRequestOtpResponse = {
  message: string;
};

export type SignupRequestOtpErrorField = "email";

export type SignupRequestOtpError = FieldErrors<SignupRequestOtpErrorField>;

// -------------------- signup-verify-otp --------------------

export type SignupVerifyOtpRequest = {
  email: string;
  otp: string;
};

export type SignupVerifyOtpResponse = {
  message: string;
};

export type SignupVerifyOtpErrorField = "email" | "otp";

export type SignupVerifyOtpError = FieldErrors<SignupVerifyOtpErrorField>;

// -------------------- signup (final submit) --------------------

export type SignupRequest = {
  email: string;
  full_name: string;
  password: string;
  username: string;
  referral_code_input: string;
  platform: LoginPlatform;
};

export type SignupResponse = {
  message: string;
  user: AuthUser;
  access?: string;
  refresh?: string;
};

export type SignupErrorField =
  | "email"
  | "full_name"
  | "password"
  | "username"
  | "referral_code_input"
  | "platform";

export type SignupError = FieldErrors<SignupErrorField>;
