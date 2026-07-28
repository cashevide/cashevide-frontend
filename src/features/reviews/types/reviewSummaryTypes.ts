// GET /reviewed-client/{clientId}/reviews/summary/

export type TagSummaryItem = {
  id: number;
  name: string;
  category: "POSITIVE" | "NEGATIVE";
  group: string;
  count: number;
};

export type ReviewSummaryResponse = {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
  tags_summary: TagSummaryItem[];
};
