import { useState } from "react";

type TagWithGroup = {
  id: number;
  group: string;
};

export function useTagSelection(
  allTags: TagWithGroup[] | undefined,
  initialSelectedIds: number[] = [],
) {
  const [selectedTagIds, setSelectedTagIds] =
    useState<number[]>(initialSelectedIds);

  const toggleTag = (tag: TagWithGroup) => {
    setSelectedTagIds((prev) => {
      const withoutGroup = prev.filter((id) => {
        const existingTag = allTags?.find((t) => t.id === id);
        return existingTag?.group !== tag.group;
      });

      if (prev.includes(tag.id)) {
        return withoutGroup;
      }
      return [...withoutGroup, tag.id];
    });
  };

  return { selectedTagIds, setSelectedTagIds, toggleTag };
}
