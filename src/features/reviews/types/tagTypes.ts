export type TagCategory = "POSITIVE" | "NEGATIVE";

export type Tag = {
  id: number;
  name: string;
  category: TagCategory;
  group: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
};

export type TagListResponse = Tag[];
