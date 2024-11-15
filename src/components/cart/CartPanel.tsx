import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, CreditCard } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useOrderStore } from '../../store/orderStore';
import { useAuthStore } from '../../store/authStore';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
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
    onClose();
    navigate('/dashboard');
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 bg-white p-4 rounded-lg border"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                      <div className="flex items-center space-x-2 mt-2">
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
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Place Order</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};