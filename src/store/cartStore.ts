import { create } from 'zustand';
import { Product } from '../types';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (product) => 
    set((state) => {
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      
      return {
        items: [...state.items, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        }],
      };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter(item => item.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0),
    })),
  clearCart: () => set({ items: [] }),
}));