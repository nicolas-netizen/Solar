import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  AlertCircle,
  Home,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Package
} from 'lucide-react';

interface SaleData {
  date: string;
  amount: number;
}

interface ProductStock {
  id: number;
  name: string;
  stock: number;
  minStock: number;
}

const mockSalesData: SaleData[] = [
  { date: '2024-01-10', amount: 5200 },
  { date: '2024-01-11', amount: 4800 },
  { date: '2024-01-12', amount: 6100 },
  { date: '2024-01-13', amount: 5900 },
  { date: '2024-01-14', amount: 6500 },
  { date: '2024-01-15', amount: 7200 },
  { date: '2024-01-16', amount: 6800 },
];

const mockLowStockProducts: ProductStock[] = [
  { id: 1, name: 'Panel Solar 400W', stock: 5, minStock: 10 },
  { id: 2, name: 'Inversor 3000W', stock: 3, minStock: 8 },
  { id: 3, name: 'Batería 200Ah', stock: 2, minStock: 5 },
];

const mockRecentOrders = [
  { id: 1, customer: 'Juan Pérez', amount: 25000, status: 'Completado', date: '2024-01-16' },
  { id: 2, customer: 'María González', amount: 15000, status: 'Pendiente', date: '2024-01-16' },
  { id: 3, customer: 'Carlos Rodríguez', amount: 40000, status: 'En Proceso', date: '2024-01-15' },
  { id: 4, customer: 'Ana Martínez', amount: 18000, status: 'Completado', date: '2024-01-15' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [salesData] = useState<SaleData[]>(mockSalesData);
  const [lowStockProducts] = useState<ProductStock[]>(mockLowStockProducts);

  // Calcular estadísticas
  const totalSales = salesData.reduce((sum, sale) => sum + sale.amount, 0);
  const averageSale = totalSales / salesData.length;
  const lastDaySale = salesData[salesData.length - 1].amount;
  const previousDaySale = salesData[salesData.length - 2].amount;
  const salesGrowth = ((lastDaySale - previousDaySale) / previousDaySale) * 100;

  const stats = [
    {
      title: 'Ventas Totales',
      value: `$${totalSales.toLocaleString()}`,
      change: `${salesGrowth.toFixed(1)}%`,
      icon: TrendingUp,
      trend: salesGrowth >= 0 ? 'up' : 'down',
    },
    {
      title: 'Clientes Nuevos',
      value: '45',
      change: '+5.6%',
      icon: Users,
      trend: 'up',
    },
    {
      title: 'Pedidos Pendientes',
      value: '12',
      change: '-2.3%',
      icon: ShoppingBag,
      trend: 'down',
    },
    {
      title: 'Stock Bajo',
      value: String(lowStockProducts.length),
      change: '0%',
      icon: AlertCircle,
      trend: 'neutral',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Panel de Control</h1>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-yellow-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Ir al Inicio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.trend === 'up' 
                          ? 'text-green-600' 
                          : stat.trend === 'down' 
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }`}>
                        {stat.change}
                        {stat.trend === 'up' && <ArrowUpRight className="h-4 w-4" />}
                        {stat.trend === 'down' && <ArrowDownRight className="h-4 w-4" />}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Productos con Stock Bajo */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-400" />
              Productos con Stock Bajo
            </h2>
            <div className="mt-4">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {lowStockProducts.map((product) => (
                    <li key={product.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">Stock Mínimo: {product.minStock}</p>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock <= product.minStock / 2
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            Stock: {product.stock}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Pedidos Recientes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gray-400" />
              Pedidos Recientes
            </h2>
            <div className="mt-4">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {mockRecentOrders.map((order) => (
                    <li key={order.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'Completado'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            ${order.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
