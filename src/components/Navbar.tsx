import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Sun, Menu, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const { isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Sun className="h-8 w-8 text-yellow-500" />
                <span className="text-xl font-bold text-gray-800">Nuevo Mundo</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/productos" className="text-gray-600 hover:text-gray-900">
                Productos
              </Link>
              <Link to="/servicios" className="text-gray-600 hover:text-gray-900">
                Servicios
              </Link>
              <Link to="/contacto" className="text-gray-600 hover:text-gray-900">
                Contacto
              </Link>
              
              {isAuthenticated ? (
                <Link 
                  to="/admin/dashboard" 
                  className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-700"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
              ) : (
                <Link 
                  to="/admin/login" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
              )}
              
              <Link to="/carrito" className="relative">
                <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-gray-900" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
            
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Navbar;