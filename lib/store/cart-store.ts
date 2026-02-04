import { create } from "zustand";

interface CartStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
