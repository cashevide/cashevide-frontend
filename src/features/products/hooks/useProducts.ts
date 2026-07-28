import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "../api/productsApi";
import type { GetProductsParams } from "../api/productsApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";

export function useProducts(params?: GetProductsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.products(params),
    queryFn: () => getProductsApi(params),
  });
}
