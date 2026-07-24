export const ROUTES = {
  login: "/login",
  reviews: "/reviews",

  signup: {
    referral: "/signup/referral",
    google: "/signup/google",
    email: "/signup/email",
    otp: "/signup/otp",
    account: "/signup/account",
  },

  legal: {
    terms: "/legal/terms",
    privacyPolicy: "/legal/privacy-policy",
  },
} as const;
