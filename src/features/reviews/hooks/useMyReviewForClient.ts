import { useQuery } from "@tanstack/react-query";
import { getMyReviewForClientApi } from "../api/reviewsApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";

export function useMyReviewForClient(clientId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.myReviewForClient(clientId),
    queryFn: () => getMyReviewForClientApi(clientId),
    enabled: !!clientId,
  });
}
