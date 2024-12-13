import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  currency: 'USD' | 'ARS';
  category: string;
  stock: string;
  imageFile: File | null;
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: '',
  currency: 'USD',
  category: '',
  stock: '',
  imageFile: null,
};

const API_URL = 'http://localhost:3001/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'ARS';
  category: string;
  stock: number;
  imageUrl: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const products = await response.json();
      setProducts(products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('currency', formData.currency);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock);
      
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      const url = editingProductId 
        ? `${API_URL}/products/${editingProductId}`
        : `${API_URL}/products`;

      console.log('Enviando solicitud a:', url);

      const response = await fetch(url, {
        method: editingProductId ? 'PUT' : 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      await loadProducts();
      setIsModalOpen(false);
      setFormData(initialFormData);
      setEditingProductId(null);
    } catch (err) {
      console.error('Error al guardar el producto:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        await loadProducts();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        setError(error instanceof Error ? error.message : 'Error al eliminar el producto');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      currency: product.currency,
      category: product.category,
      stock: product.stock.toString(),
      imageFile: null,
    });
    setEditingProductId(product.id);
    setIsModalOpen(true);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Solo se permiten archivos PNG y JPG/JPEG');
      e.target.value = ''; // Reset input
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError('La imagen no debe superar los 5MB');
      e.target.value = ''; // Reset input
      return;
    }

    setError(''); // Clear any previous errors
    setFormData({ ...formData, imageFile: file });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-0">Gestión de Productos</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto bg-yellow-500 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2"
          onClick={() => {
            setFormData(initialFormData);
            setEditingProductId(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Producto</span>
        </motion.button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4 sm:mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <AnimatePresence>
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
              onClick={() => handleViewDetails(product)}
            >
              <div className="aspect-square w-full relative">
                <img
                  src={product.imageUrl || '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white bg-opacity-90 text-blue-500 rounded-full shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(product);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white bg-opacity-90 text-red-500 rounded-full shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mt-1 mb-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-500 font-bold">
                    {product.currency === 'ARS' ? 'AR$' : '$'} {product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">({product.stock} unidades)</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2">
                    <img
                      src={selectedProduct.imageUrl || '/placeholder.png'}
                      alt={selectedProduct.name}
                      className="w-full h-[300px] object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    />
                  </div>
                  <div className="p-6 md:w-1/2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedProduct.name}</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Descripción</h3>
                        <p className="text-gray-600">{selectedProduct.description}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700">Precio</h3>
                          <p className="text-2xl font-bold text-yellow-500">
                            {selectedProduct.currency === 'ARS' ? 'AR$' : '$'} {selectedProduct.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <h3 className="text-lg font-semibold text-gray-700">Stock</h3>
                          <p className="text-xl font-semibold text-gray-600">{selectedProduct.stock} unidades</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Categoría</h3>
                        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {selectedProduct.category}
                        </span>
                      </div>
                      <div className="flex space-x-2 mt-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDetailModalOpen(false);
                            handleEdit(selectedProduct);
                          }}
                          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                          Editar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                              handleDelete(selectedProduct.id);
                              setIsDetailModalOpen(false);
                            }
                          }}
                          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 shadow-xl max-w-lg w-full max-h-screen overflow-y-auto"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {editingProductId ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows={3}
                  required
                />
              </div>
              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d.]/g, '');
                      setFormData({ ...formData, price: value });
                    }}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value as 'USD' | 'ARS' })
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                  </select>
                </div>
              </div>
              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="text"
                  value={formData.stock}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, stock: value });
                  }}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              {/* Imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen
                </label>
                <div className="flex justify-center items-center px-4 py-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="file-upload"
                    className="text-yellow-600 cursor-pointer hover:underline"
                  >
                    Subir imagen o arrastrar aquí
                  </label>
                </div>
                {formData.imageFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Archivo seleccionado: {formData.imageFile.name}
                  </p>
                )}
              </div>
              {/* Botones */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData(initialFormData);
                    setEditingProductId(null);
                    setError('');
                    setIsLoading(false);
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 flex items-center space-x-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Products;
