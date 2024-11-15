import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { Dumbbell, ShoppingCart, User, LogOut } from 'lucide-react';
import { CartPanel } from '../cart/CartPanel';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8" />
              <span className="font-bold text-xl">GymPro</span>
            </Link>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                  <Link to="/schedule" className="hover:text-gray-300">Schedule</Link>
                  <Link to="/store" className="hover:text-gray-300">Store</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="hover:text-gray-300">Admin</Link>
                  )}
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="relative hover:text-gray-300"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </button>
                  <div className="flex items-center space-x-2">
                    <User className="h-6 w-6" />
                    <span>{user?.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 hover:text-gray-300"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-gray-300">Login</Link>
                  <Link to="/register" className="hover:text-gray-300">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};