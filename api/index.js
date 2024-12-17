import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Configurar rutas de archivos
const DATA_DIR = join(process.cwd(), 'data');
const PRODUCTS_FILE = join(DATA_DIR, 'products.json');
const ORDERS_FILE = join(DATA_DIR, 'orders.json');

// Crear directorios si no existen
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// Función para leer productos
const readProducts = () => {
  try {
    if (!existsSync(PRODUCTS_FILE)) {
      writeFileSync(PRODUCTS_FILE, '[]', 'utf8');
      return [];
    }
    const data = readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

// Función para escribir productos
const writeProducts = (products) => {
  try {
    writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing products:', error);
    return false;
  }
};

// Función para leer órdenes
const readOrders = () => {
  try {
    if (!existsSync(ORDERS_FILE)) {
      writeFileSync(ORDERS_FILE, '[]', 'utf8');
      return [];
    }
    const data = readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
};

// Función para escribir órdenes
const writeOrders = (orders) => {
  try {
    writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing orders:', error);
    return false;
  }
};

// Rutas de productos
app.get('/api/products', (req, res) => {
  try {
    const products = readProducts();
    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Error al leer productos' });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const products = readProducts();
    const newProduct = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    if (writeProducts(products)) {
      res.status(201).json(newProduct);
    } else {
      res.status(500).json({ error: 'Error al guardar el producto' });
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updatedProduct = {
      ...products[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    products[index] = updatedProduct;
    
    if (writeProducts(products)) {
      res.json(updatedProduct);
    } else {
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const filteredProducts = products.filter(p => p.id !== req.params.id);
    
    if (writeProducts(filteredProducts)) {
      res.status(204).send();
    } else {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// Rutas para órdenes
app.get('/api/orders', (req, res) => {
  try {
    const orders = readOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const orders = readOrders();
    const newOrder = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    
    if (writeOrders(orders)) {
      res.status(201).json(newOrder);
    } else {
      res.status(500).json({ error: 'Error al guardar la orden' });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const orders = readOrders();
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
});

export default app;
