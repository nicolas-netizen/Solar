import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  stock: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_URL = 'http://localhost:3001/api';

// Función para cargar datos locales
const loadLocalProducts = async () => {
  try {
    const response = await import('../data/products.json');
    return response.default;
  } catch (error) {
    console.error('Error loading local products:', error);
    return [];
  }
};

export const getProducts = async () => {
  try {
    // Intentar cargar desde el servidor
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const products = await response.json();
      return { products, error: null };
    } catch (serverError) {
      console.warn('Fallback to local data:', serverError);
      // Si falla, cargar datos locales
      const localProducts = await loadLocalProducts();
      return { products: localProducts, error: null };
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], error: error instanceof Error ? error.message : 'Error desconocido' };
  }
};

export const createProduct = async (productData: FormData) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      body: productData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    const product = await response.json();
    return { product, error: null };
  } catch (error) {
    console.error('Error creating product:', error);
    return { product: null, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
};

export const updateProduct = async (id: string, productData: FormData) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    const product = await response.json();
    return { product, error: null };
  } catch (error) {
    console.error('Error updating product:', error);
    return { product: null, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    
    return { error: null };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { error: error instanceof Error ? error.message : 'Error desconocido' };
  }
};
