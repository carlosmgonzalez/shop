"use client";

import { useGetProductById, useUpdateItemInCart } from "@/hooks";
import { use } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/utils/formatters";
import { Separator } from "@/components/ui/separator";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading } = useGetProductById(id);
  const { mutate: updateItemInCart, isPending: isUpdatingItemInCart } =
    useUpdateItemInCart();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 h-screen flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">Product not found</div>
        </div>
      </div>
    );
  }

  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image Carousel */}
        <div className="w-full">
          {hasImages ? (
            <Carousel className="w-full">
              <CarouselContent>
                {product.images.map((image) => (
                  <CarouselItem key={image.id}>
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={image.url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {product.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </>
              )}
            </Carousel>
          ) : (
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
              <div className="text-muted-foreground text-center">
                <p className="text-lg">No hay imágenes disponibles</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-start space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
              </span>
              <Badge
                variant={product.stock > 0 ? "secondary" : "destructive"}
                className="text-sm"
              >
                {product.stock > 0 ? `${product.stock} en stock` : "Sin stock"}
              </Badge>
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={product.stock === 0 || isUpdatingItemInCart}
              onClick={() =>
                updateItemInCart({ productId: product.id, quantity: 1 })
              }
            >
              {isUpdatingItemInCart ? (
                <Spinner className="size-4" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <ShoppingCart className="size-5" />
                  Agregar al carrito
                </div>
              )}
            </Button>

            <Separator />

            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
