import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyReviewApi } from "../api/myReviewApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";
import type {
  UpdateMyReviewRequest,
  UpdateMyReviewResponse,
} from "../types/reviewTypes";

type UpdateMyReviewVariables = {
  id: number;
  payload: UpdateMyReviewRequest;
};

export function useUpdateMyReview() {
  const queryClient = useQueryClient();

  return useMutation<UpdateMyReviewResponse, Error, UpdateMyReviewVariables>({
    mutationFn: ({ id, payload }) => updateMyReviewApi(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reviewSummary(data.client),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.myReviewForClient(data.client),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.myReviewDetail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.myReviews,
      });
    },
  });
}
