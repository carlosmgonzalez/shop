import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useDeleteProductImage() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { imageId: number }>({
    mutationFn: async ({ imageId }) => {
      await axios.delete(`/api/product/image/${imageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
