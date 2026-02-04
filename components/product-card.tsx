import Image from "next/image";
import { ProductDataType } from "@/interfaces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function ProductCard({ product }: { product: ProductDataType }) {
  const router = useRouter();

  return (
    <Card className="group relative mx-auto w-full max-w-sm overflow-hidden pt-0 transition-shadow hover:shadow-lg">
      <button
        className="relative aspect-square w-full overflow-hidden bg-gray-100 cursor-pointer"
        onClick={() => router.push(`/product/${product.id}`)}
      >
        {product.images?.[0]?.url ? (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>
      <CardHeader className="px-2 py-0">
        <CardTitle>{product.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 py-0">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {product.stock} in stock
          </Badge>
          <p className="text-sm text-muted-foreground">${product.price}</p>
        </div>
      </CardContent>
      <CardFooter className="px-2 py-0">
        <Button className="w-full">Add to cart</Button>
      </CardFooter>
    </Card>
  );
}
