export const AUTH_ENDPOINTS = {
  login: "/users/login/",
  logout: "/users/logout/",
  refresh: "/users/token/refresh/",
  profile: "/users/profile/me/",

  signup: "/users/signup/",
  signupRequestOtp: "/users/signup-request-otp/",
  signupVerifyOtp: "/users/signup-verify-otp/",
  checkUser: "/users/check-user/",
  checkReferralCode: "/users/check-referral-code/",
} as const;
