import { useMutation } from "@tanstack/react-query";
import { clientLookupApi } from "../api/clientLookupApi";
import type {
  ClientLookupRequest,
  ClientLookupSuccessResponse,
} from "../types/clientTypes";

export function useClientLookup() {
  return useMutation<ClientLookupSuccessResponse, Error, ClientLookupRequest>({
    mutationFn: clientLookupApi,
  });
}
