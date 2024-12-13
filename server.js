import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Servir archivos estáticos desde la carpeta public
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Funciones auxiliares para manejar el archivo JSON
const getProducts = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
};

const saveProducts = (products) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, 'data/products.json'),
      JSON.stringify(products, null, 2),
      'utf8'
    );
    return true;
  } catch (error) {
    console.error('Error writing products file:', error);
    return false;
  }
};

// Funciones auxiliares para manejar órdenes
const getOrders = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data/orders.json'), 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading orders file:', error);
    return [];
  }
};

const saveOrders = (orders) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, 'data/orders.json'),
      JSON.stringify(orders, null, 2),
      'utf8'
    );
    return true;
  } catch (error) {
    console.error('Error writing orders file:', error);
    return false;
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png)'));
  },
});

// Función para generar PDF de la orden
const generateOrderPDF = (order, res) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  });

  doc.pipe(res);

  // Añadir un fondo de color suave al encabezado
  doc.rect(0, 0, doc.page.width, 150)
     .fill('#f3f4f6');

  // Logo y nombre de la empresa
  doc.fontSize(24)
     .fillColor('#1e3a8a')
     .text('SOLAR', 50, 50, { align: 'left' });

  doc.fontSize(10)
     .fillColor('#4b5563')
     .text('Lisandro de la Torre 2662', 50, 80)
     .text('Buenos Aires, Argentina', 50, 95)
     .text('Tel: (11) 3306-3086', 50, 110);

  // Información de la orden en el lado derecho
  doc.fontSize(10)
     .text('Orden #' + order.id, 400, 50)
     .text('Fecha: ' + new Date(order.createdAt).toLocaleDateString(), 400, 65)
     .text('Estado: ' + order.status, 400, 80);

  // Línea divisoria
  doc.moveTo(50, 150)
     .lineTo(550, 150)
     .stroke('#e5e7eb');

  // Información del cliente
  doc.fontSize(16)
     .fillColor('#1e3a8a')
     .text('Información del Cliente', 50, 180);

  doc.fontSize(10)
     .fillColor('#4b5563')
     .text('Nombre:', 50, 210)
     .fillColor('#000000')
     .text(order.customerInfo.name, 150, 210)
     .fillColor('#4b5563')
     .text('Email:', 50, 230)
     .fillColor('#000000')
     .text(order.customerInfo.email, 150, 230)
     .fillColor('#4b5563')
     .text('Teléfono:', 50, 250)
     .fillColor('#000000')
     .text(order.customerInfo.phone, 150, 250)
     .fillColor('#4b5563')
     .text('Dirección:', 50, 270)
     .fillColor('#000000')
     .text(order.customerInfo.address, 150, 270);

  // Detalles del pedido
  doc.fontSize(16)
     .fillColor('#1e3a8a')
     .text('Detalles del Pedido', 50, 320);

  // Encabezados de la tabla
  doc.fontSize(10)
     .fillColor('#4b5563');

  // Dibujar fondo de encabezados
  doc.rect(50, 350, 500, 20)
     .fill('#f3f4f6');

  doc.fillColor('#000000')
     .text('Producto', 60, 355)
     .text('Cantidad', 300, 355)
     .text('Precio Unit.', 380, 355)
     .text('Total', 480, 355);

  // Productos
  let y = 380;
  order.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    if (isEven) {
      doc.rect(50, y - 5, 500, 25)
         .fill('#f9fafb');
    }

    doc.fillColor('#000000')
       .text(item.name, 60, y)
       .text(item.quantity.toString(), 300, y)
       .text('$' + item.price.toFixed(2), 380, y)
       .text('$' + (item.price * item.quantity).toFixed(2), 480, y);
    
    y += 25;
  });

  // Línea divisoria antes del total
  doc.moveTo(50, y + 10)
     .lineTo(550, y + 10)
     .stroke('#e5e7eb');

  // Total
  doc.fontSize(12)
     .text('Total:', 400, y + 30)
     .fontSize(16)
     .fillColor('#1e3a8a')
     .text('$' + order.total.toFixed(2), 480, y + 30);

  // Método de pago
  doc.fontSize(10)
     .fillColor('#4b5563')
     .text('Método de pago: ' + order.paymentMethod, 50, y + 30);

  // Pie de página
  const footerY = doc.page.height - 100;
  doc.fontSize(8)
     .fillColor('#9ca3af')
     .text('Gracias por tu compra', 50, footerY, { align: 'center' })
     .text('Para cualquier consulta, contáctanos al (11) 3306-3086', 50, footerY + 15, { align: 'center' });

  doc.end();
};

// Routes
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);
    console.log('Archivo recibido:', req.file);

    const { name, description, price, currency, category, stock } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      console.log('Imagen guardada:', imageUrl);
    }

    const products = getProducts();
    const newProduct = {
      id: Date.now().toString(),
      name,
      description,
      price: parseFloat(price),
      currency,
      category,
      stock: parseInt(stock),
      imageUrl,
      createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    
    if (saveProducts(products)) {
      res.status(201).json(newProduct);
    } else {
      res.status(500).json({ error: 'Error al guardar el producto' });
    }
  } catch (error) {
    console.error('Error detallado al crear producto:', error);
    res.status(500).json({ 
      error: 'Error al crear el producto',
      details: error.message 
    });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error detallado al obtener productos:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos',
      details: error.message 
    });
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const products = getProducts();
    const updatedProducts = products.filter(p => p.id !== req.params.id);
    
    if (saveProducts(updatedProducts)) {
      res.json({ message: 'Producto eliminado exitosamente' });
    } else {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  } catch (error) {
    console.error('Error detallado al eliminar producto:', error);
    res.status(500).json({ 
      error: 'Error al eliminar el producto',
      details: error.message 
    });
  }
});

// Update product
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, currency, category, stock } = req.body;
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updatedProduct = {
      ...products[productIndex],
      name,
      description,
      price: parseFloat(price),
      currency,
      category,
      stock: parseInt(stock),
      updatedAt: new Date().toISOString()
    };

    if (req.file) {
      updatedProduct.imageUrl = `/uploads/${req.file.filename}`;
    }

    products[productIndex] = updatedProduct;
    
    if (saveProducts(products)) {
      res.json(updatedProduct);
    } else {
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  } catch (error) {
    console.error('Error detallado al actualizar producto:', error);
    res.status(500).json({ 
      error: 'Error al actualizar el producto',
      details: error.message 
    });
  }
});

// Rutas para órdenes
app.post('/api/orders', async (req, res) => {
  try {
    const { customerInfo, items, paymentMethod, total } = req.body;
    
    const orders = getOrders();
    const newOrder = {
      id: Date.now().toString(),
      customerInfo,
      items,
      paymentMethod,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    
    if (saveOrders(orders)) {
      res.status(201).json(newOrder);
    } else {
      res.status(500).json({ error: 'Error al guardar la orden' });
    }
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ 
      error: 'Error al crear la orden',
      details: error.message 
    });
  }
});

// Obtener todas las órdenes (para el panel de admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = getOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ 
      error: 'Error al obtener órdenes',
      details: error.message 
    });
  }
});

// Actualizar estado de una orden
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === req.params.id);

    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString()
    };
    
    if (saveOrders(orders)) {
      res.json(orders[orderIndex]);
    } else {
      res.status(500).json({ error: 'Error al actualizar la orden' });
    }
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(500).json({ 
      error: 'Error al actualizar la orden',
      details: error.message 
    });
  }
});

// Ruta para descargar PDF de la orden
app.get('/api/orders/:id/pdf', async (req, res) => {
  try {
    const orders = getOrders();
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=orden-${order.id}.pdf`);
    
    generateOrderPDF(order, res);
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ 
      error: 'Error al generar PDF',
      details: error.message 
    });
  }
});

// Dashboard Stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const orders = getOrders();
    const products = getProducts();
    const customers = [];

    orders.forEach(order => {
      const customer = customers.find(c => c.email === order.customerInfo.email);

      if (!customer) {
        customers.push({
          email: order.customerInfo.email,
          name: order.customerInfo.name,
          totalOrders: 1,
          totalSpent: order.total,
          lastOrderDate: order.createdAt
        });
      } else {
        customer.totalOrders++;
        customer.totalSpent += order.total;
        customer.lastOrderDate = order.createdAt;
      }
    });

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Get recent orders
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        customerName: order.customerInfo.name,
        total: order.total,
        status: order.status,
        date: order.createdAt
      }));

    // Calculate product stats
    const productStats = products
      .map(product => ({
        name: product.name,
        sold: orders.filter(order => 
          order.items.some(item => item.id === product.id)
        ).length,
        revenue: orders.reduce((sum, order) => {
          const productOrder = order.items.find(item => item.id === product.id);
          return sum + (productOrder ? productOrder.price * productOrder.quantity : 0);
        }, 0)
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    // Get recent customers with their stats
    const customerStats = customers.map(customer => ({
      id: customer.email,
      name: customer.name,
      email: customer.email,
      totalSpent: customer.totalSpent,
      totalOrders: customer.totalOrders,
      lastOrderDate: customer.lastOrderDate
    }));

    const recentCustomers = customerStats
      .sort((a, b) => (b.lastOrderDate || 0) - (a.lastOrderDate || 0))
      .slice(0, 5);

    res.json({
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalRevenue,
      totalProducts: products.length,
      recentOrders,
      productStats,
      recentCustomers
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ error: 'Error getting dashboard stats' });
  }
});

// Customers Endpoints
app.get('/api/customers', async (req, res) => {
  try {
    const orders = getOrders();
    const customers = [];

    orders.forEach(order => {
      const customer = customers.find(c => c.email === order.customerInfo.email);

      if (!customer) {
        customers.push({
          email: order.customerInfo.email,
          name: order.customerInfo.name,
          totalOrders: 1,
          totalSpent: order.total,
          lastOrderDate: order.createdAt
        });
      } else {
        customer.totalOrders++;
        customer.totalSpent += order.total;
        customer.lastOrderDate = order.createdAt;
      }
    });

    res.json(customers);
  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({ error: 'Error getting customers' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('CORS habilitado para http://localhost:5173');
});