import type { GetClientsParams } from "@/src/features/clients/api/clientsApi";

export const QUERY_KEYS = {
  reviewTags: ["reviewTags"] as const,

  reviewSummary: (clientId: string) => ["reviewSummary", clientId] as const,
  myReviewForClient: (clientId: string) =>
    ["myReviewForClient", clientId] as const,

  myReviews: ["myReviews"] as const,
  myReviewDetail: (id: number) => ["myReviewDetail", id] as const,

  clients: (params?: GetClientsParams) => ["clients", params] as const,
  clientDetail: (slug: string) => ["clientDetail", slug] as const,
  clientUsage: ["clientUsage"] as const,
} as const;
