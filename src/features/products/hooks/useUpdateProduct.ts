import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductApi } from "../api/productsApi";
import { QUERY_KEYS } from "@/src/shared/api/queryKeys";
import type {
  UpdateProductRequest,
  UpdateProductResponse,
} from "../types/productTypes";

type UpdateProductVariables = {
  slug: string;
  payload: UpdateProductRequest;
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation<UpdateProductResponse, Error, UpdateProductVariables>({
    mutationFn: ({ slug, payload }) => updateProductApi(slug, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.productDetail(data.slug),
      });
    },
  });
}
