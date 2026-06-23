export type ReviewTagId = number;

export type ReviewTagCategory = "positive" | "negative" | "neutral" | string;

export type ReviewTagGroup = string;

export type ReviewTag = {
  id: ReviewTagId;
  name: string;
  category: ReviewTagCategory;
  group: ReviewTagGroup;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
};
