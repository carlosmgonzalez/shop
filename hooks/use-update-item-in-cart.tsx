import { InsertCartItem } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function useUpdateItemInCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: InsertCartItem) => {
      const response = await axios.post("/api/cart", item);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Producto actualizado en el carrito");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al actualizar el producto en el carrito");
    },
  });
}
