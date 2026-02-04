"use client";

import { ProductCard } from "@/components/product-card";
import { useGetProducts } from "@/hooks";

export default function Home() {
  const { data: products } = useGetProducts();
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
