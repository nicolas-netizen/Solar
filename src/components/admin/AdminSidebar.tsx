import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="w-full md:w-64 bg-gray-900 text-white transition-all duration-300 ease-in-out">
      <div className="sticky top-0 p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-gray-100">Panel Admin</h1>
      </div>
      
      <nav className="mt-6 px-4">
        <div className="space-y-1">
          <Link
            to="/admin/dashboard"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200 group"
          >
            <LayoutDashboard className="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link
            to="/admin/products"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200 group"
          >
            <Package className="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" />
            <span className="font-medium">Productos</span>
          </Link>
          
          <Link
            to="/admin/orders"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200 group"
          >
            <ShoppingCart className="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" />
            <span className="font-medium">Pedidos</span>
          </Link>
          
          <Link
            to="/admin/customers"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200 group"
          >
            <Users className="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" />
            <span className="font-medium">Clientes</span>
          </Link>
          
          <Link
            to="/admin/settings"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200 group"
          >
            <Settings className="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" />
            <span className="font-medium">Configuración</span>
          </Link>
        </div>
      </nav>
      
      <div className="px-4 mt-12">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 group"
        >
          <LogOut className="h-5 w-5 mr-3 text-gray-400 group-hover:text-white" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;