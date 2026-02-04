import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ProductType } from "@/db/schema";

export function useGetProducts() {
  return useQuery<ProductType[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get<ProductType[]>("/api/product");
      return response.data;
    },
  });
}
