import type { Href } from "expo-router";

export const ROUTES = {
  welcome: "/welcome",
  login: "/login",

  passwordReset: {
    entry: "/password-reset",
    otp: "/password-reset/otp",
    reset: "/password-reset/reset",
  },

  signup: {
    referral: "/signup/referral",
    email: "/signup/email",
    otp: "/signup/otp",
    account: "/signup/account",

    google: {
      referral: "/signup/google/referral",
      username: "/signup/google/username",
    },
  },

  legal: {
    terms: "/legal/terms",
    privacyPolicy: "/legal/privacy-policy",
  },

  settings: {
    security: {
      entry: "/settings/security",
      changePassword: "/settings/security/change-password",
    },
  },

  reviews: {
    home: "/reviews",
    add: (clientId?: string): Href =>
      (clientId ? `/reviews/add?clientId=${clientId}` : "/reviews/add") as Href,
    summary: (clientId: string): Href => `/reviews/${clientId}` as Href,
    edit: (clientId: string): Href => `/reviews/${clientId}/edit` as Href,
  },

  invoices: {
    clients: {
      list: "/invoices/clients",
      create: "/invoices/clients/create",
      detail: (clientSlug: string): Href =>
        `/invoices/clients/${clientSlug}` as Href,
      edit: (clientSlug: string): Href =>
        `/invoices/clients/${clientSlug}/edit` as Href,
    },
  },
} as const;
