export const QUERY_KEYS = {
  reviewTags: ["reviewTags"] as const,

  reviewSummary: (clientId: string) => ["reviewSummary", clientId] as const,
  myReviewForClient: (clientId: string) =>
    ["myReviewForClient", clientId] as const,

  myReviews: ["myReviews"] as const,
  myReviewDetail: (id: number) => ["myReviewDetail", id] as const,
} as const;
