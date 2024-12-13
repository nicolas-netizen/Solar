import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from "../store/cartStore";
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-16 text-center"
      >
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <ShoppingBag className="h-20 w-20 text-yellow-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800">Tu carrito está vacío</h2>
          <p className="text-gray-600 text-lg">¡Agrega algunos productos para comenzar!</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/productos"
              className="mt-6 inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200"
            >
              Ver Productos
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 py-12"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tu Carrito</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearCart}
          className="text-red-500 hover:text-red-600 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
        >
          <Trash2 className="w-5 h-5" />
          Vaciar carrito
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-lg shadow-lg p-6 mb-4 flex items-center hover:shadow-xl transition-shadow duration-200"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={item.imageUrl || '/placeholder.png'}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="ml-6 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 mt-1">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="w-5 h-5 text-gray-600" />
                    </motion.button>
                    <span className="mx-4 font-medium text-lg w-8 text-center">{item.quantity}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="w-5 h-5 text-gray-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item.id)}
                      className="ml-auto p-2 text-red-500 hover:text-red-600 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 h-fit"
        >
          <h2 className="text-2xl font-bold mb-6">Resumen del pedido</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Envío</span>
              <span className="text-green-500">Gratis</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/checkout')}
              className="w-full bg-yellow-500 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-yellow-600 transition-colors duration-200 mt-6"
            >
              Proceder al pago
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
