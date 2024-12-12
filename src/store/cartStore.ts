import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../../firebase/products';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              total: state.total + product.price,
            };
          }
          return {
            items: [...state.items, { ...product, quantity: 1 }],
            total: state.total + product.price,
          };
        });
      },
      removeItem: (productId) => {
        set((state) => {
          const item = state.items.find((i) => i.id === productId);
          return {
            items: state.items.filter((i) => i.id !== productId),
            total: state.total - (item ? item.price * item.quantity : 0),
          };
        });
      },
      updateQuantity: (productId, quantity) => {
        set((state) => {
          const item = state.items.find((i) => i.id === productId);
          if (!item) return state;
          
          const oldTotal = item.price * item.quantity;
          const newTotal = item.price * quantity;
          
          return {
            items: state.items.map((i) =>
              i.id === productId ? { ...i, quantity } : i
            ),
            total: state.total - oldTotal + newTotal,
          };
        });
      },
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
