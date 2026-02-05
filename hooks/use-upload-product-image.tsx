import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ImageProductType } from "@/db/schema";

interface UploadImageResponse {
  image: ImageProductType;
}

export function useUploadProductImage() {
  const queryClient = useQueryClient();
  return useMutation<
    ImageProductType,
    Error,
    { productId: number; file: File }
  >({
    mutationFn: async ({ productId, file }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post<UploadImageResponse>(
        `/api/product/image/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.image;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Error uploading product image:", error);
    },
  });
}
