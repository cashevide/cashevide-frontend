import { useMutation } from "@tanstack/react-query";
import { createReviewedClientApi } from "../api/reviewedClientsApi";
import type {
  CreateReviewedClientRequest,
  CreateReviewedClientResponse,
} from "../types/clientTypes";

export function useCreateReviewedClient() {
  return useMutation<
    CreateReviewedClientResponse,
    Error,
    CreateReviewedClientRequest
  >({
    mutationFn: createReviewedClientApi,
  });
}
