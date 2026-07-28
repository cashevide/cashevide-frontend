import { useQuery } from "@tanstack/react-query";
import { getReviewSummaryApi } from "../api/reviewSummaryApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";

export function useReviewSummary(clientId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.reviewSummary(clientId),
    queryFn: () => getReviewSummaryApi(clientId),
    enabled: !!clientId,
  });
}
