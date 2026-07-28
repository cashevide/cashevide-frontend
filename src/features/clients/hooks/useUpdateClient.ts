import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClientApi } from "../api/clientsApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";
import type {
  UpdateClientRequest,
  UpdateClientResponse,
} from "../types/clientTypes";

type UpdateClientVariables = {
  slug: string;
  payload: UpdateClientRequest;
};

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation<UpdateClientResponse, Error, UpdateClientVariables>({
    mutationFn: ({ slug, payload }) => updateClientApi(slug, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.clientDetail(data.slug),
      });
    },
  });
}
