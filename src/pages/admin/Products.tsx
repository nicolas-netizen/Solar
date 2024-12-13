import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader } from 'lucide-react';
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

// Función para cargar datos locales
const loadLocalProducts = async () => {
  try {
    const response = await import('../../../data/products.json');
    return response.default;
  } catch (error) {
    console.error('Error loading local products:', error);
    return [];
  }
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Intentar cargar desde el servidor
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const products = await response.json();
        setProducts(products);
      } catch (serverError) {
        console.warn('Fallback to local data:', serverError);
        // Si falla, cargar datos locales
        const localProducts = await loadLocalProducts();
        setProducts(localProducts);
      }
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

  const handleEdit = (product: any) => {
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
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
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-md overflow-hidden max-w-[300px]"
            >
              <img
                src={product.imageUrl || '/placeholder.png'}
                alt={product.name}
                className="w-full h-36 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500 font-bold">
                    {product.currency === 'ARS' ? 'AR$' : '$'} {product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">({product.currency})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{product.stock} unidades</span>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                      onClick={() => handleDelete(product.id!)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
