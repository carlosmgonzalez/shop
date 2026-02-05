import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CartItemType } from "@/db/schema";
import { ProductDataType } from "@/interfaces";

export interface CartItemWithProduct extends CartItemType {
  product: ProductDataType;
}

interface CartResponse {
  items: CartItemWithProduct[];
}

export function useGetCart() {
  return useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await axios.get<CartResponse>("/api/cart", {
        withCredentials: true, // Asegura que las cookies se envíen
      });
      return response.data;
    },
  });
}
