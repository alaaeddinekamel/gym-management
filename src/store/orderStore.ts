import { create } from 'zustand';
import { Order } from '../types';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  addOrder: (order) => 
    set((state) => ({
      orders: [order, ...state.orders],
    })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map(order =>
        order.id === orderId
          ? { ...order, status }
          : order
      ),
    })),
  deleteOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.filter(order => order.id !== orderId),
    })),
}));