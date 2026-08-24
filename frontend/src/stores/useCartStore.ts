import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/models';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          if (product.stock_quantity < 1 || quantity < 1) {
            return state;
          }

          const existingItem = state.items.find(
            (item) => item.product.id === product.id,
          );
          const nextQuantity = Math.min(
            (existingItem?.quantity ?? 0) + quantity,
            product.stock_quantity,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { product, quantity: nextQuantity }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity: nextQuantity }],
          };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((item) => item.product.id !== productId)
              : state.items.map((item) =>
                  item.product.id === productId
                    ? {
                        ...item,
                        quantity: Math.min(quantity, item.product.stock_quantity),
                      }
                    : item,
                ),
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'voltflow_cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
