import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from "../store/cartStore";
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <ShoppingBag className="h-16 w-16 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-700">Tu carrito está vacío</h2>
          <p className="text-gray-500">¡Agrega algunos productos para comenzar!</p>
          <Link
            to="/productos"
            className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center"
              >
                <img
                  src={item.imageUrl || '/placeholder.png'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-500">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                    onClick={() => updateQuantity(item.id!, Math.max(0, item.quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </motion.button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                    onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 rounded-full text-red-500 hover:bg-red-50"
                    onClick={() => removeItem(item.id!)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 sticky top-4"
          >
            <h3 className="text-xl font-semibold mb-4">Resumen del Pedido</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Proceder al Pago
            </button>
            <button
              className="w-full mt-2 text-gray-500 hover:text-gray-700"
              onClick={clearCart}
            >
              Vaciar Carrito
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
