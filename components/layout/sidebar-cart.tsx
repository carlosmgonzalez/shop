"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useGetCart, useUpdateItemInCart } from "@/hooks";
import { useCartStore } from "@/lib/store";
import { Spinner } from "../ui/spinner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash } from "lucide-react";
import { CartItemWithProduct } from "@/hooks/use-get-cart";
import { formatPrice } from "@/lib/utils/formatters";
import { useRouter } from "next/navigation";

export function SidebarCart() {
  const router = useRouter();

  const { isOpen, setIsOpen } = useCartStore();
  const { data: cart, isLoading: isLoadingCart } = useGetCart();
  const { mutate: updateCartItem, isPending: isUpdatingCart } =
    useUpdateItemInCart();
  // Calcular el total del carrito
  const total =
    cart?.items.reduce((acc, item) => {
      const price = item.product.price ?? 0;
      return acc + price * item.quantity;
    }, 0) || 0;

  const handleIncreaseQuantity = (productId: number | null) => {
    if (productId === null) return;
    updateCartItem({ productId, quantity: 1 });
  };

  const handleDecreaseQuantity = (productId: number | null) => {
    if (productId === null) return;
    updateCartItem({ productId, quantity: -1 });
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) return;
    router.push("/checkout");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Carrito de compras</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            {isLoadingCart && (
              <div className="flex items-center justify-center h-full">
                <Spinner className="size-4" />
              </div>
            )}
            {!isLoadingCart && cart?.items.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">
                  Tu carrito está vacío
                </p>
              </div>
            )}
            {!isLoadingCart && cart && cart.items.length > 0 && (
              <div className="space-y-4 px-2">
                {cart.items.map((item: CartItemWithProduct) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    {/* Imagen del producto */}
                    <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-gray-100">
                      {item.product.images?.[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-xs">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-medium text-sm line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatPrice(item.product.price ?? 0)}
                        </p>
                      </div>

                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-2 mt-2">
                        {item.quantity === 1 ? (
                          <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => {
                              if (item.productId !== null) {
                                handleDecreaseQuantity(item.productId);
                              }
                            }}
                            disabled={isUpdatingCart || item.productId === null}
                            className="h-7 w-7"
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => {
                              if (item.productId !== null) {
                                handleDecreaseQuantity(item.productId);
                              }
                            }}
                            disabled={
                              isUpdatingCart ||
                              item.quantity < 1 ||
                              item.productId === null
                            }
                            className="h-7 w-7"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        )}

                        <span className="text-sm font-medium min-w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => {
                            if (item.productId !== null) {
                              handleIncreaseQuantity(item.productId);
                            }
                          }}
                          disabled={isUpdatingCart || item.productId === null}
                          className="h-7 w-7"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Precio total del item */}
                    <div className="flex flex-col justify-end items-end">
                      <p className="text-sm font-semibold">
                        {formatPrice((item.product.price ?? 0) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <SheetFooter className="border-t pt-4">
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-lg font-semibold">
                  {formatPrice(total)}
                </span>
              </div>
              <Button
                className="w-full"
                disabled={!cart || cart.items.length === 0}
                onClick={handleCheckout}
              >
                Finalizar compra
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
