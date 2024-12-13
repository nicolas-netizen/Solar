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

const API_URL = 'http://localhost:3001/api';

// Función para cargar datos locales
const loadLocalOrders = async () => {
  try {
    const response = await import('../../../data/orders.json');
    return response.default;
  } catch (error) {
    console.error('Error loading local orders:', error);
    return [];
  }
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
    setIsLoading(true);
    try {
      // Intentar cargar desde el servidor
      try {
        const response = await fetch(`${API_URL}/orders`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } catch (serverError) {
        console.warn('Fallback to local data:', serverError);
        // Si falla, cargar datos locales
        const localOrders = await loadLocalOrders();
        setOrders(localOrders);
        setFilteredOrders(localOrders);
      }
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
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
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
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
      window.open(`${API_URL}/orders/${orderId}/pdf`, '_blank');
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Administración de Órdenes</h1>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, email o ID"
                className="w-full pl-10 pr-3 py-2 border rounded-md"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">Todos</option>
              {Object.entries(OrderStatus).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">Todas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">Todos</option>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">Orden #{order.id}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadPDF(order.id)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                  title="Descargar PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
                <span className={`px-3 py-1 rounded-full text-sm ${OrderStatus[order.status as keyof typeof OrderStatus].color}`}>
                  {OrderStatus[order.status as keyof typeof OrderStatus].label}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="ml-2 border rounded-md text-sm p-1"
                >
                  {Object.entries(OrderStatus).map(([value, { label }]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Información del Cliente</h3>
                <div className="text-sm">
                  <p><span className="font-medium">Nombre:</span> {order.customerInfo.name}</p>
                  <p><span className="font-medium">Email:</span> {order.customerInfo.email}</p>
                  <p><span className="font-medium">Teléfono:</span> {order.customerInfo.phone}</p>
                  <p><span className="font-medium">Dirección:</span> {order.customerInfo.address}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Detalles del Pedido</h3>
                <div className="text-sm">
                  <p><span className="font-medium">Método de pago:</span> {order.paymentMethod}</p>
                  <p><span className="font-medium">Total:</span> ${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Productos</h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
