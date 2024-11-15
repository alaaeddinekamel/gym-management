import React from 'react';
import { Trash2, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';

export const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const user = useAuthStore((state) => state.user);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handlePlaceOrder = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      products: items.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: total,
      status: 'pending' as const,
      orderDate: new Date()
    };

    addOrder(order);
    clearCart();
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="bg-white rounded-lg shadow-sm">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="p-6 flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button 
                      className="px-2 py-1 border rounded-md hover:bg-gray-100"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button 
                      className="px-2 py-1 border rounded-md hover:bg-gray-100"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Place Order</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};