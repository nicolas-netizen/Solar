import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  AlertCircle,
  Home 
} from 'lucide-react';

const stats = [
  {
    title: 'Ventas Totales',
    value: '$15,231',
    change: '+12.5%',
    icon: TrendingUp,
  },
  {
    title: 'Clientes Nuevos',
    value: '45',
    change: '+5.6%',
    icon: Users,
  },
  {
    title: 'Pedidos Pendientes',
    value: '12',
    change: '-2.3%',
    icon: ShoppingBag,
  },
  {
    title: 'Stock Bajo',
    value: '3',
    change: '0%',
    icon: AlertCircle,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.change.startsWith('+') ? 'text-green-600' : 
                        stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
