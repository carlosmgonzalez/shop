import { ImageProductType, ProductType } from "@/db/schema";

export type ProductDataType = ProductType & {
  images: ImageProductType[];
};
