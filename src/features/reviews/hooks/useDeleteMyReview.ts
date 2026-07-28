import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMyReviewApi } from "../api/myReviewApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";

type DeleteMyReviewVariables = {
  id: number;
  clientId: string;
};

export function useDeleteMyReview() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteMyReviewVariables>({
    mutationFn: ({ id }) => deleteMyReviewApi(id),
    onSuccess: (_data, { id, clientId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reviewSummary(clientId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.myReviewForClient(clientId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.myReviewDetail(id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.myReviews,
      });
    },
  });
}
