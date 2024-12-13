import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts, type Product } from "../../firebase/products";
import { useCartStore } from "../store/cartStore";

const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNotification, setShowNotification] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { products: fetchedProducts, error: fetchError } = await getProducts();
        if (fetchError) throw new Error(fetchError);
        if (fetchedProducts.length === 0) {
          throw new Error('No hay productos disponibles');
        }
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error loading products:', err);
        setError(err instanceof Error ? err.message : 'Error loading products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Memoizar las categorías para evitar recálculos innecesarios
  const categories = React.useMemo(() => 
    ['all', ...new Set(products.map((p) => p.category))],
    [products]
  );

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  // Memoizar los productos filtrados
  const filteredProducts = React.useMemo(() => 
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory),
    [products, selectedCategory]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Categorías */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Categorías</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category === 'all' ? 'Todos' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={product.imageUrl || '/placeholder.png'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-500 font-bold">
                    {product.currency === 'ARS' ? 'AR$' : '$'} {product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Stock: {product.stock} unidades
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Notificación */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            Producto agregado al carrito
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductCatalog;
