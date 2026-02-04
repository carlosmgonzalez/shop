"use client";

import { useGetProductById } from "@/hooks";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading } = useGetProductById(id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">Product not found</div>
        </div>
      </div>
    );
  }

  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="container mx-auto py-8 px-4">
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
                <p className="text-lg">No image available</p>
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
              <span className="text-3xl font-bold">${product.price}</span>
              <Badge
                variant={product.stock > 0 ? "secondary" : "destructive"}
                className="text-sm"
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </Badge>
            </div>

            <div className="pt-4 border-t">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Product Details</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">${product.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Stock</span>
                <span className="font-medium">{product.stock} units</span>
              </div>
              {product.createdAt && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Added</span>
                  <span className="font-medium text-sm">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card> */}

          <Button size="lg" className="w-full" disabled={product.stock === 0}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
