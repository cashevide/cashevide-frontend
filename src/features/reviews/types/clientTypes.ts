// Generic DRF field-error shape — same pattern as authTypes.ts / signupTypes.ts.
type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

// -------------------- shared shape --------------------
// phone_number here is always the SHA-256 hashed value from the backend
// (e.g. "sha256$..."). Never the plain number. Never display this in the UI.
export type ReviewedClient = {
  id: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

// -------------------- client-lookup --------------------
export type ClientLookupRequest = {
  phone_number: string;
};

export type ClientLookupSuccessResponse = {
  client_id: string;
  message: string;
};

export type ClientLookupNotFoundError = {
  error: "client not found";
};

export type ClientLookupInvalidFormatError = {
  error: string;
};

export type ClientLookupFieldErrorField = "phone_number";
export type ClientLookupFieldError = FieldErrors<ClientLookupFieldErrorField>;

// Covers both the custom {error} shapes (not-found / invalid-format) and
// the DRF field-error shape (missing field).
export type ClientLookupError =
  | ClientLookupNotFoundError
  | ClientLookupInvalidFormatError
  | ClientLookupFieldError;

// -------------------- reviewed-clients (create-or-get) --------------------
export type CreateReviewedClientRequest = {
  phone_number: string;
};

// Same shape for both 200 (existing) and 201 (created) — status code differs, not the body.
export type CreateReviewedClientResponse = ReviewedClient;

export type CreateReviewedClientErrorField = "phone_number";
export type CreateReviewedClientError =
  FieldErrors<CreateReviewedClientErrorField>;
