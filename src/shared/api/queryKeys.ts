import type { GetClientsParams } from "@/src/features/clients/api/clientsApi";
import type { GetProductsParams } from "@/src/features/products/api/productsApi";
import type { GetInvoicesParams } from "@/src/features/invoices/api/invoicesApi";

export const QUERY_KEYS = {
  userProfile: ["userProfile"] as const,
  businessProfile: ["businessProfile"] as const,

  reviewTags: ["reviewTags"] as const,

  reviewSummary: (clientId: string) => ["reviewSummary", clientId] as const,
  myReviewForClient: (clientId: string) =>
    ["myReviewForClient", clientId] as const,

  myReviews: ["myReviews"] as const,
  myReviewDetail: (id: number) => ["myReviewDetail", id] as const,

  clients: (params?: GetClientsParams) => ["clients", params] as const,
  clientDetail: (slug: string) => ["clientDetail", slug] as const,
  clientUsage: ["clientUsage"] as const,

  products: (params?: GetProductsParams) => ["products", params] as const,
  productDetail: (slug: string) => ["productDetail", slug] as const,
  productUsage: ["productUsage"] as const,

  invoices: (params?: GetInvoicesParams) => ["invoices", params] as const,
  invoiceDetail: (id: number) => ["invoiceDetail", id] as const,
  invoiceDashboard: ["invoiceDashboard"] as const,
} as const;
