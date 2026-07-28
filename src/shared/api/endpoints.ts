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

  google: "/users/google/",

  passwordResetRequestOtp: "/users/password-reset-request-otp/",
  passwordResetVerifyOtp: "/users/password-reset-verify-otp/",
  resetPassword: "/users/reset-password/",

  changePassword: "/users/change-password/",
  deleteAccount: "/users/profile/delete/",
} as const;

export const LEGAL_ENDPOINTS = {
  document: (docType: string) => `/legal/${docType}/`,
  accept: "/legal/accept/",
} as const;

export const REVIEWS_ENDPOINTS = {
  clientLookup: "/client-lookup/",
  reviewedClients: "/reviewed-clients/",

  clientReviews: (clientId: string) => `/reviewed-client/${clientId}/reviews/`,
  clientReviewDetail: (clientId: string, id: number) =>
    `/reviewed-client/${clientId}/reviews/${id}/`,
  clientReviewSummary: (clientId: string) =>
    `/reviewed-client/${clientId}/reviews/summary/`,
  clientMyReview: (clientId: string) =>
    `/reviewed-client/${clientId}/reviews/my-review/`,

  tags: "/tags/",

  myReviews: "/my-reviews/",
  myReviewDetail: (id: number) => `/my-reviews/${id}/`,
} as const;

export const CLIENT_ENDPOINTS = {
  list: "/clients/",
  create: "/clients/",
  detail: (slug: string) => `/clients/${slug}/`,
  usage: "/clients/usage/",
} as const;
