export type ReviewedClientId = string;

export type ClientLookupRequest = {
  phone_number: string;
};

export type ClientLookupResponse = {
  client_id: ReviewedClientId;
  message?: string;
};

export type CreateReviewedClientRequest = {
  phone_number: string;
};

export type ReviewedClient = {
  id: ReviewedClientId;
  phone_number?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
};

export type CreateReviewedClientResponse = ReviewedClient;
