import type { ReviewRating } from "./reviewTypes";
import type {
  ReviewTagCategory,
  ReviewTagGroup,
  ReviewTagId,
} from "./tagTypes";

export type RatingDistribution = Record<ReviewRating, number>;

export type ReviewSummaryTag = {
  id: ReviewTagId;
  name: string;
  category: ReviewTagCategory;
  group: ReviewTagGroup;
  count: number;
};

export type ReviewSummary = {
  average_rating: number;
  total_reviews: number;
  rating_distribution: RatingDistribution;
  tags_summary: ReviewSummaryTag[];
};
