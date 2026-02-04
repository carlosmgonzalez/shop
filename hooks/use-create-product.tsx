import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { InsertProduct, ProductType } from "@/db/schema";

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation<ProductType, Error, InsertProduct>({
    mutationFn: async (product: InsertProduct) => {
      const response = await axios.post<ProductType>("/api/product", product);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
