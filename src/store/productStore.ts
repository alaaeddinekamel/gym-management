import { create } from 'zustand';
import { Product } from '../types';

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [
    {
      id: '1',
      name: 'Premium Yoga Mat',
      description: 'High-quality, non-slip yoga mat perfect for all types of workouts',
      price: 29.99,
      category: 'Equipment',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: '2',
      name: 'Whey Protein Powder',
      description: 'Premium whey protein isolate for muscle recovery and growth',
      price: 49.99,
      category: 'Supplements',
      stock: 100,
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: '3',
      name: 'Adjustable Dumbbell Set',
      description: 'Space-saving adjustable dumbbells from 5-52.5 lbs',
      price: 299.99,
      category: 'Equipment',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd0bbb?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: '4',
      name: 'Performance Tank Top',
      description: 'Moisture-wicking fabric for intense workouts',
      price: 24.99,
      category: 'Apparel',
      stock: 75,
      image: 'https://images.unsplash.com/photo-1577221084712-45b0445d2b00?auto=format&fit=crop&q=80&w=400',
    }
  ],
  addProduct: (product) => 
    set((state) => ({
      products: [...state.products, product]
    })),
  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map(product =>
        product.id === id
          ? { ...product, ...updatedProduct }
          : product
      )
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter(product => product.id !== id)
    })),
}));