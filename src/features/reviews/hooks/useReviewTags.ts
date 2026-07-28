import { useQuery } from "@tanstack/react-query";
import { getTagsApi } from "../api/tagsApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";

export function useReviewTags() {
  return useQuery({
    queryKey: QUERY_KEYS.reviewTags,
    queryFn: getTagsApi,
    staleTime: 1000 * 60 * 60,
  });
}
