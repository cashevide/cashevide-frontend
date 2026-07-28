import type { GetClientsParams } from "@/src/features/clients/api/clientsApi";
import type { GetProductsParams } from "@/src/features/products/api/productsApi";

export const QUERY_KEYS = {
  userProfile: ["userProfile"] as const,

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
} as const;
