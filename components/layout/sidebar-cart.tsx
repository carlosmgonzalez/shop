"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/store";

export function SidebarCart() {
  const { isOpen, setIsOpen } = useCartStore();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Carrito de compras</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm text-muted-foreground">
                Tu carrito está vacío
              </p>
            </div>
          </div>
          <SheetFooter className="border-t pt-4">
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-lg font-semibold">$0.00</span>
              </div>
              <button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
                disabled
              >
                Finalizar compra
              </button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
