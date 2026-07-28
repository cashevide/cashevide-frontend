import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReviewApi } from "../api/reviewsApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";
import type {
  CreateReviewRequest,
  CreateReviewResponse,
} from "../types/reviewTypes";

type CreateReviewVariables = {
  clientId: string;
  payload: CreateReviewRequest;
};

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation<CreateReviewResponse, Error, CreateReviewVariables>({
    mutationFn: ({ clientId, payload }) => createReviewApi(clientId, payload),
    onSuccess: (_data, { clientId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.reviewSummary(clientId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.myReviewForClient(clientId),
      });
    },
  });
}
