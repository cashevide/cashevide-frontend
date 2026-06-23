import type { ReviewedClientId, ReviewedClient } from "./clientTypes";
import type { ReviewTag, ReviewTagId } from "./tagTypes";

export type ReviewId = number;

export type ReviewRating = 1 | 2 | 3 | 4 | 5;

export type CreateReviewRequest = {
  ratings: ReviewRating | null;
  tags: ReviewTagId[];
};

export type UpdateReviewRequest = {
  ratings?: ReviewRating | null;
  tags?: ReviewTagId[];
};

export type MyReview = {
  id: ReviewId;
  ratings: ReviewRating | null;
  tags: ReviewTagId[];
  client: ReviewedClientId;
  created_at: string;
  updated_at: string;
};

export type MyReviewResponse =
  | {
      exists: true;
      review: MyReview;
    }
  | {
      exists: false;
      review: null;
    };

export type ReviewListItem = {
  id: ReviewId;
  author?: string;
  ratings: ReviewRating | null;
  tags: ReviewTag[];
  client?: ReviewedClient;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
};

export type PaginatedReviewsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ReviewListItem[];
};
