// Generic DRF field-error shape — same pattern as signupTypes.ts.
type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

// -------------------- password-reset-request-otp --------------------

export type PasswordResetRequestOtpRequest = {
  email: string;
};

export type PasswordResetRequestOtpResponse = {
  message: string;
};

export type PasswordResetRequestOtpErrorField = "email";

export type PasswordResetRequestOtpError =
  FieldErrors<PasswordResetRequestOtpErrorField>;

// -------------------- password-reset-verify-otp --------------------

export type PasswordResetVerifyOtpRequest = {
  email: string;
  otp: string;
};

export type PasswordResetVerifyOtpResponse = {
  message: string;
};

export type PasswordResetVerifyOtpErrorField = "otp";

export type PasswordResetVerifyOtpError =
  FieldErrors<PasswordResetVerifyOtpErrorField>;

// -------------------- reset-password (final submit) --------------------

export type ResetPasswordRequest = {
  email: string;
  new_password: string;
};

export type ResetPasswordSuccessResponse = {
  detail: string;
};

export type ResetPasswordErrorField = "email" | "new_password";

export type ResetPasswordError = FieldErrors<ResetPasswordErrorField>;
