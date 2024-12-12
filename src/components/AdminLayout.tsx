import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuthStore } from '../store/authStore';
import { LogOut, Home } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <header className="bg-white shadow">
          <div className="px-4 py-3 flex justify-between items-center">
            <button
              onClick={goToHome}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <Home className="w-5 h-5" />
              <span>Ir al Inicio</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </header>
        <main className="bg-gray-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
