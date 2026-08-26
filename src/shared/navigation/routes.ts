import type { Href } from "expo-router";

export const ROUTES = {
  // App-wide landing route after login/signup — independent of which tab
  // it currently points to. Change this single value to move the app's
  // default home; every redirect site should reference ROUTES.home, never
  // a specific tab's own route (e.g. reviews.home, invoices.dashboard).
  home: "/invoices",

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
    home: "/settings",
    account: "/settings/account",
    theme: "/settings/theme",
    legal: "/settings/legal",

    security: {
      entry: "/settings/security",
      changePassword: "/settings/security/change-password",
    },
  },

  profile: {
    home: "/profile",
    edit: "/profile/edit",
    business: "/profile/business",
    businessEdit: "/profile/business-edit",
  },

  reviews: {
    home: "/reviews",
    add: (clientId?: string): Href =>
      (clientId ? `/reviews/add?clientId=${clientId}` : "/reviews/add") as Href,
    summary: (clientId: string): Href => `/reviews/${clientId}` as Href,
    edit: (clientId: string): Href => `/reviews/${clientId}/edit` as Href,
  },

  invoices: {
    dashboard: "/invoices",
    list: "/invoices/invoices",
    create: "/invoices/create",
    detail: (invoiceId: number): Href => `/invoices/${invoiceId}` as Href,
    edit: (invoiceId: number, section?: "payments"): Href =>
      (section
        ? `/invoices/${invoiceId}/edit?section=${section}`
        : `/invoices/${invoiceId}/edit`) as Href,

    clients: {
      list: "/invoices/clients",
      create: "/invoices/clients/create",
      archived: "/invoices/clients/archived",
      detail: (clientSlug: string): Href =>
        `/invoices/clients/${clientSlug}` as Href,
      edit: (clientSlug: string): Href =>
        `/invoices/clients/${clientSlug}/edit` as Href,
    },

    products: {
      list: "/invoices/products",
      create: "/invoices/products/create",
      archived: "/invoices/products/archived",
      detail: (productSlug: string): Href =>
        `/invoices/products/${productSlug}` as Href,
      edit: (productSlug: string): Href =>
        `/invoices/products/${productSlug}/edit` as Href,
    },
  },
} as const;
