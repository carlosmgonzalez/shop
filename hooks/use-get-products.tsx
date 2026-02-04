import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ProductDataType } from "@/interfaces";

export function useGetProducts() {
  return useQuery<ProductDataType[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get<ProductDataType[]>("/api/product");
      return response.data;
    },
  });
}
