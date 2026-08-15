import { useInfiniteQuery } from "@tanstack/react-query";

import { getProductsApi } from "../api/productsApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";
import { getPageFromUrl } from "@/src/shared/api/pagination";

import type { GetProductsParams } from "../api/productsApi";
import type { ProductsListResponse } from "../types/productTypes";

export function useProducts(params?: GetProductsParams) {
  return useInfiniteQuery<ProductsListResponse, Error>({
    queryKey: QUERY_KEYS.products(params),
    queryFn: ({ pageParam }) =>
      getProductsApi({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => getPageFromUrl(lastPage.next),
  });
}
