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
    <div className="w-64 bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Panel Admin</h1>
      </div>
      
      <nav className="space-y-2">
        <Link
          to="/admin/dashboard"
          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        
        <Link
          to="/admin/products"
          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
        >
          <Package className="h-5 w-5" />
          <span>Productos</span>
        </Link>
        
        <Link
          to="/admin/orders"
          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Pedidos</span>
        </Link>
        
        <Link
          to="/admin/customers"
          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
        >
          <Users className="h-5 w-5" />
          <span>Clientes</span>
        </Link>
        
        <Link
          to="/admin/settings"
          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
        >
          <Settings className="h-5 w-5" />
          <span>Configuración</span>
        </Link>
        
        <Link
          to="/admin/products"
          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded"
        >
          <Package className="h-5 w-5" />
          <span>Products</span>
        </Link>
      </nav>
      
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded mt-auto absolute bottom-4 w-52"
      >
        <LogOut className="h-5 w-5" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default AdminSidebar;