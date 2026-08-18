// Generic DRF field-error shape — same pattern as other typed files.
type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

// -------------------- shared shape --------------------
export type BusinessProfile = {
  user_id: number;
  business_name: string;
  logo: string | null;
  gst_number: string;
  vat_number: string;
  address: string;
  phone_number: string;
  business_email: string;
  website: string;
  currency: string;
};

// -------------------- retrieve --------------------
// GET /users/business-profile/me/
export type BusinessProfileResponse = BusinessProfile;

// -------------------- update --------------------
// PATCH /users/business-profile/me/
export type UpdateBusinessProfileRequest = {
  business_name?: string;
  gst_number?: string;
  vat_number?: string;
  address?: string;
  phone_number?: string;
  business_email?: string;
  website?: string;
  currency?: string;
  logo?: {
    uri: string;
    name: string;
    type: string;
  } | null;
};

export type UpdateBusinessProfileResponse = BusinessProfile;

export type UpdateBusinessProfileErrorField =
  | "business_name"
  | "gst_number"
  | "vat_number"
  | "address"
  | "phone_number"
  | "business_email"
  | "website"
  | "currency"
  | "logo";
export type UpdateBusinessProfileError =
  FieldErrors<UpdateBusinessProfileErrorField>;
