import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configurar rutas de archivos
const DATA_DIR = join(__dirname, '..', 'data');
const UPLOADS_DIR = join(__dirname, '..', 'public', 'uploads');
const PRODUCTS_FILE = join(DATA_DIR, 'products.json');
const ORDERS_FILE = join(DATA_DIR, 'orders.json');

// Crear directorios si no existen
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Servir archivos estáticos
app.use('/uploads', express.static(UPLOADS_DIR));

// Función para leer productos
const readProducts = () => {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      fs.writeFileSync(PRODUCTS_FILE, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

// Función para escribir productos
const writeProducts = (products) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing products:', error);
    return false;
  }
};

// Función para leer órdenes
const readOrders = () => {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
};

// Función para escribir órdenes
const writeOrders = (orders) => {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing orders:', error);
    return false;
  }
};

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

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

app.post('/api/products', upload.single('image'), (req, res) => {
  try {
    const products = readProducts();
    const newProduct = {
      id: Date.now().toString(),
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      currency: req.body.currency,
      category: req.body.category,
      stock: parseInt(req.body.stock),
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
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

app.put('/api/products/:id', upload.single('image'), (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updatedProduct = {
      ...products[index],
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      currency: req.body.currency,
      category: req.body.category,
      stock: parseInt(req.body.stock),
      updatedAt: new Date().toISOString()
    };

    if (req.file) {
      if (products[index].imageUrl) {
        const oldImagePath = join(__dirname, '..', 'public', products[index].imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updatedProduct.imageUrl = `/uploads/${req.file.filename}`;
    }

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
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (product.imageUrl) {
      const imagePath = join(__dirname, '..', 'public', product.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

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

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Para Vercel
export default app;
