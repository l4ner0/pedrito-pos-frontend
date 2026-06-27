import { create } from "zustand";
import { type ApiProduct } from "@/services/productService";

export interface CartItem {
  product: ApiProduct;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  discountAmount: number | null;
  addItem: (product: ApiProduct) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  setDiscount: (amount: number | null) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  discountAmount: null,

  addItem: (product: ApiProduct) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    })),

  updateQuantity: (productId, qty) =>
    set((state) => ({
      items:
        qty <= 0
          ? state.items.filter((i) => i.product.id !== productId)
          : state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity: qty } : i,
            ),
    })),

  clearCart: () => set({ items: [], discountAmount: null }),

  setDiscount: (amount) => set({ discountAmount: amount }),
}));
