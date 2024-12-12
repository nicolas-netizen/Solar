import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  AlertCircle 
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
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-2 rounded">
                <stat.icon className="h-6 w-6 text-yellow-600" />
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') 
                  ? 'text-green-600' 
                  : stat.change.startsWith('-') 
                    ? 'text-red-600' 
                    : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
      
      {/* Placeholder for charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm h-96">
          <h3 className="text-lg font-semibold mb-4">Ventas Mensuales</h3>
          <div className="flex items-center justify-center h-full text-gray-400">
            Gráfico de Ventas
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm h-96">
          <h3 className="text-lg font-semibold mb-4">Últimos Pedidos</h3>
          <div className="flex items-center justify-center h-full text-gray-400">
            Tabla de Pedidos
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;