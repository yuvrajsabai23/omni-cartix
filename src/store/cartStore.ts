"use client";

import { ProductType } from "@prisma/client";
import Decimal from "decimal.js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: string; // ex-VAT as string (Decimal serialized)
  vatRate: string; // e.g. "0.20"
  type: ProductType;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  hydrate: (items: CartItem[]) => void;
  get itemCount(): number;
  get subtotal(): Decimal;
  get vatTotal(): Decimal;
  get grandTotal(): Decimal;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      hydrate: (items: CartItem[]) => set({ items }),

      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      get subtotal() {
        return get().items.reduce((sum, item) => {
          return sum.add(new Decimal(item.price).mul(item.quantity));
        }, new Decimal(0));
      },

      get vatTotal() {
        return get().items.reduce((sum, item) => {
          const price = new Decimal(item.price).mul(item.quantity);
          return sum.add(price.mul(new Decimal(item.vatRate)));
        }, new Decimal(0)).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
      },

      get grandTotal() {
        return get().subtotal.add(get().vatTotal);
      },
    }),
    {
      name: "omni-cartix-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
