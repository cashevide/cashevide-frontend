// Generic DRF field-error shape — same pattern as other typed files.
type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

// -------------------- shared shape --------------------
export type Client = {
  id: number;
  user: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  slug: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

// -------------------- list --------------------
// GET /clients/
export type ClientsListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Client[];
};

// -------------------- create --------------------
// POST /clients/
export type CreateClientRequest = {
  name: string;
  email?: string;
  phone: string;
  address?: string;
};

export type CreateClientResponse = Client;

export type CreateClientErrorField = "name" | "email" | "phone" | "address";
export type CreateClientError = FieldErrors<CreateClientErrorField>;

// -------------------- detail --------------------
// GET /clients/{slug}/
export type ClientDetailResponse = Client;

export type ClientNotFoundError = {
  detail: string;
};

// -------------------- update --------------------
// PATCH /clients/{slug}/
export type UpdateClientRequest = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
};

export type UpdateClientResponse = Client;

export type UpdateClientError = CreateClientError;

// -------------------- usage --------------------
// GET /clients/usage/
export type ClientUsageResponse = {
  current_client_count: number;
  max_allowed_client: number | null;
};
