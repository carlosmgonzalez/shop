"use client";

import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { Spinner } from "@/components/ui/spinner";
import { useGetProducts } from "@/hooks";

export default function Home() {
  const { data: products, isLoading } = useGetProducts();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }
  return (
    <div className="w-full">
      {/* Banner */}
      <div className="w-full relative aspect-video max-h-[500px] mb-8">
        <Image
          src="https://res.cloudinary.com/difikt7so/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1770329824/products/xwsqhzv8gh8svozcflim.png"
          alt="Banner"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Productos */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
