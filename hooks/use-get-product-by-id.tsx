import { ProductDataType } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await axios.get<ProductDataType>(`/api/product/${id}`);
      return response.data;
    },
  });
}
