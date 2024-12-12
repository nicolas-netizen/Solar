import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 md:hidden">
      <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-4">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            <X className="h-6 w-6" />
          </button>
          
          <nav className="mt-8 space-y-4">
            <Link 
              to="/productos" 
              className="block py-2 text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              Productos
            </Link>
            <Link 
              to="/servicios" 
              className="block py-2 text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              Servicios
            </Link>
            <Link 
              to="/contacto" 
              className="block py-2 text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              Contacto
            </Link>
            <Link 
              to="/admin/login" 
              className="block py-2 text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;