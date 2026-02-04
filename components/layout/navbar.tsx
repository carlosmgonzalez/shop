"use client";

import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";

export function Navbar() {
  const { toggleCart } = useCartStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Título */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity"
          >
            <span className="text-primary">Shop</span>
          </Link>
        </div>

        {/* Navegación - oculta en móvil */}
        {/* <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Productos
          </Link>
        </nav> */}

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
            <ShoppingCart className="h-5 w-5" />
            {/* Badge del carrito - puedes agregar el número de items aquí */}
            {/* <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              0
            </span> */}
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
