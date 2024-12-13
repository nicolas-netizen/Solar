import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  ChevronUp,
  ChevronDown,
  Home,
  ArrowLeft
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
  }>;
  productStats: {
    name: string;
    sold: number;
    revenue: number;
  }[];
  recentCustomers: Array<{
    id: string;
    name: string;
    email: string;
    totalSpent: number;
    totalOrders: number;
  }>;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalProducts: 0,
    recentOrders: [],
    productStats: [],
    recentCustomers: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold"
        >
          Dashboard
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <Home className="h-5 w-5" />
          <span>Volver al Inicio</span>
        </motion.button>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {/* Total Orders */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Órdenes</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        {/* Total Customers */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Clientes</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalCustomers}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        {/* Total Revenue */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Ingresos Totales</p>
              <h3 className="text-2xl font-bold mt-1">
                ${stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        {/* Total Products */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Productos</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalProducts}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ShoppingBag className="h-5 w-5 text-yellow-500 mr-2" />
            Órdenes Recientes
          </h2>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <motion.div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-500">
                    ${order.total.toFixed(2)}
                  </p>
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    {order.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <Link
            to="/admin/orders"
            className="mt-4 inline-block text-yellow-500 hover:text-yellow-600"
          >
            Ver todas las órdenes →
          </Link>
        </motion.div>

        {/* Recent Customers Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 text-yellow-500 mr-2" />
            Clientes Recientes
          </h2>
          <div className="space-y-4">
            {stats.recentCustomers?.map((customer) => (
              <motion.div
                key={customer.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-yellow-500">
                    ${customer.totalSpent.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {customer.totalOrders} órdenes
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <Link
            to="/admin/customers"
            className="mt-4 inline-block text-yellow-500 hover:text-yellow-600"
          >
            Ver todos los clientes →
          </Link>
        </motion.div>

        {/* Top Products */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Productos Más Vendidos</h2>
          <div className="space-y-4">
            {stats.productStats.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sold} vendidos</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${product.revenue}</p>
                  <p className="text-sm text-gray-500">Ingresos</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
