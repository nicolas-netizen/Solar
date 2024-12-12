import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingBag, LayoutDashboard } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      path: '/admin/products',
      label: 'Productos',
      icon: <Package className="w-5 h-5" />,
    },
    {
      path: '/admin/orders',
      label: 'Órdenes',
      icon: <ShoppingBag className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-white shadow-md w-64 min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 ${
              isActive(item.path) ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
