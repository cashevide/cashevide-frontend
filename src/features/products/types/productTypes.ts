// Generic DRF field-error shape — same pattern as other typed files.
type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

// -------------------- shared shape --------------------
export type Product = {
  id: number;
  user: number;
  title: string;
  description: string;
  unit_price: string;
  slug: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

// -------------------- list --------------------
// GET /products/
export type ProductsListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
};

// -------------------- create --------------------
// POST /products/
export type CreateProductRequest = {
  title: string;
  description?: string;
  unit_price: string;
};

export type CreateProductResponse = Product;

export type CreateProductErrorField = "title" | "description" | "unit_price";
export type CreateProductError = FieldErrors<CreateProductErrorField>;

// -------------------- detail --------------------
// GET /products/{slug}/
export type ProductDetailResponse = Product;

export type ProductNotFoundError = {
  detail: string;
};

// -------------------- update --------------------
// PATCH /products/{slug}/
// Note: slug may change in the response even if title didn't — backend
// regenerates the slug on every save(), not just when title changes.
// Always navigate using the slug from the response, never the old one.
export type UpdateProductRequest = {
  title?: string;
  description?: string;
  unit_price?: string;
  is_active?: boolean;
};

export type UpdateProductResponse = Product;

export type UpdateProductError = CreateProductError;

// -------------------- usage --------------------
// GET /products/usage/
export type ProductUsageResponse = {
  current_product_count: number;
  max_allowed_product: number | null;
};
