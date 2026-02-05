"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { useGetCart } from "@/hooks/use-get-cart";
import { Badge } from "../ui/badge";
import { useMemo } from "react";
import Image from "next/image";

export function Navbar() {
  const { toggleCart } = useCartStore();
  const { data: cart } = useGetCart();

  const totalItems = useMemo(() => {
    return cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  }, [cart]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Título */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity"
          >
            <Image
              src="https://res.cloudinary.com/difikt7so/image/upload/v1770330577/products/zvkva0rgpnrrp2rfynsw.png"
              alt="Logo"
              width={160}
              height={160}
            />
          </Link>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          {/* Botón del carrito */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            className="relative"
            aria-label="Abrir carrito"
          >
            <ShoppingCart className="size-5" />
            {/* Badge del carrito - puedes agregar el número de items aquí */}
            {totalItems > 0 && (
              <Badge
                variant="default"
                className="text-xs absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center"
              >
                {totalItems}
              </Badge>
            )}
          </Button>

          {/* Menú móvil - opcional */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Menú"
          >
            <Menu className="h-5 w-5" />
          </Button> */}
        </div>
      </div>
    </header>
  );
}
