import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductCatalog from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import Login from './pages/admin/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </>
            }
          />
          
          <Route
            path="/productos"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <ProductCatalog />
                </main>
                <Footer />
              </>
            }
          />
          
          <Route
            path="/carrito"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Cart />
                </main>
                <Footer />
              </>
            }
          />
          
          <Route
            path="/checkout"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Checkout />
                </main>
                <Footer />
              </>
            }
          />
          
          <Route
            path="/order-confirmation"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <OrderConfirmation />
                </main>
                <Footer />
              </>
            }
          />
          
          <Route
            path="/servicios"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Nuestros Servicios</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* Add your service cards here */}
                      <p className="text-gray-600">Página en construcción...</p>
                    </div>
                  </div>
                </main>
                <Footer />
              </>
            }
          />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;