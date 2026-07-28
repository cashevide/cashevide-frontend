import { useQuery } from "@tanstack/react-query";
import { getClientsApi } from "../api/clientsApi";
import type { GetClientsParams } from "../api/clientsApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";

export function useClients(params?: GetClientsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.clients(params),
    queryFn: () => getClientsApi(params),
  });
}
