import type { Tag } from "./tagTypes";
import type { ReviewedClient } from "./clientTypes";

// Generic DRF field-error shape — same pattern as other typed files.
type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

// -------------------- shared shapes --------------------
// This is the shape returned by ReviewSerializer — used for:
// create response, PATCH response, and the `review` field inside my-review.
// tags/author/client here are IDs only, not nested objects.
export type Review = {
  id: number;
  author: number;
  ratings: number | null;
  tags: number[];
  client: string;
  created_at: string;
  updated_at: string;
};

// -------------------- create review --------------------
// POST /reviewed-client/{clientId}/reviews/
export type CreateReviewRequest = {
  ratings?: number | null;
  tags: number[];
};

export type CreateReviewResponse = Review;

export type CreateReviewFieldErrorField = "ratings" | "tags";
export type CreateReviewFieldError = FieldErrors<CreateReviewFieldErrorField>;

// Non-field errors: duplicate review, invalid/missing client.
export type CreateReviewDetailError = {
  detail: string;
};

export type CreateReviewError =
  | CreateReviewFieldError
  | CreateReviewDetailError;

// -------------------- my-review for a client --------------------
// GET /reviewed-client/{clientId}/reviews/my-review/
export type MyReviewForClientResponse = {
  exists: boolean;
  review: Review | null;
};

// -------------------- update my review --------------------
// PATCH /my-reviews/{id}/
export type UpdateMyReviewRequest = {
  ratings?: number | null;
  tags?: number[];
};

export type UpdateMyReviewResponse = Review;

export type UpdateMyReviewError = CreateReviewFieldError;

// -------------------- list / detail my reviews --------------------
// GET /my-reviews/ and GET /my-reviews/{id}/
// This is UserReviewListSerializer — a DIFFERENT shape from `Review` above:
// tags is nested Tag[], author is a username string, client is a nested object.
export type MyReviewListItem = {
  id: number;
  ratings: number | null;
  tags: Tag[];
  author: string;
  created_at: string;
  updated_at: string;
  client: ReviewedClient;
};

export type MyReviewsListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: MyReviewListItem[];
};

export type MyReviewDetailResponse = MyReviewListItem;
