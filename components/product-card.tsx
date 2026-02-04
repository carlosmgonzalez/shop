import { ProductType } from "@/db/schema";

export function ProductCard({ product }: { product: ProductType }) {
  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <p>{product.stock}</p>
    </div>
  );
}
