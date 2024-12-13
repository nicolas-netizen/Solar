import React, { useEffect, useState } from 'react';
import { Download, Search } from 'lucide-react';

interface Order {
  id: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  paymentMethod: string;
  total: number;
  status: string;
  createdAt: string;
}

const OrderStatus = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Procesando', color: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completado', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter, paymentMethodFilter]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/orders');
      if (!response.ok) {
        throw new Error('Error al obtener las órdenes');
      }
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.includes(searchTerm)
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filtro por fecha
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const orderDate = new Date(today);
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(order => 
            new Date(order.createdAt).getTime() >= today.getTime()
          );
          break;
        case 'week':
          orderDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(order => 
            new Date(order.createdAt).getTime() >= orderDate.getTime()
          );
          break;
        case 'month':
          orderDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(order => 
            new Date(order.createdAt).getTime() >= orderDate.getTime()
          );
          break;
      }
    }

    // Filtro por método de pago
    if (paymentMethodFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentMethod === paymentMethodFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la orden');
      }

      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Error al actualizar el estado');
    }
  };

  const downloadPDF = async (orderId: string) => {
    try {
      window.open(`http://localhost:3001/api/orders/${orderId}/pdf`, '_blank');
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      alert('Error al descargar el PDF');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Administración de Órdenes</h1>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, email o ID"
              className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-colors"
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-colors"
          >
            <option value="all">Estado: Todos</option>
            {Object.entries(OrderStatus).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-colors"
          >
            <option value="all">Fecha: Todas</option>
            <option value="today">Hoy</option>
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
          </select>

          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-colors"
          >
            <option value="all">Pago: Todos</option>
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
          </select>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header de la orden */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold">#{order.id}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm ${OrderStatus[order.status as keyof typeof OrderStatus].color}`}>
                      {OrderStatus[order.status as keyof typeof OrderStatus].label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="text-sm p-2 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  >
                    {Object.entries(OrderStatus).map(([value, { label }]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => downloadPDF(order.id)}
                    className="p-2 text-gray-600 hover:text-gray-800 bg-gray-50 rounded-lg"
                    title="Descargar PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contenido de la orden */}
            <div className="p-4">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Información del Cliente</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Nombre:</span>
                      <span className="font-medium">{order.customerInfo.name}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{order.customerInfo.email}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Teléfono:</span>
                      <span className="font-medium">{order.customerInfo.phone}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Dirección:</span>
                      <span className="font-medium">{order.customerInfo.address}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Productos</h3>
                  <div className="space-y-2 text-sm">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-2">
                          <span>{item.name}</span>
                          <span className="text-gray-500">x{item.quantity}</span>
                        </div>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 font-medium">
                      <span>Total</span>
                      <span className="text-yellow-500">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
