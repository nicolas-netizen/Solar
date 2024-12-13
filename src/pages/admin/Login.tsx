import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Home } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { signInUser } from '../../../firebase/auth.ts';
import type { LoginCredentials } from '../../types/auth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user, error: authError } = await signInUser(credentials.email, credentials.password);
      
      if (authError) {
        // Handle specific Firebase auth errors
        switch(true) {
          case authError.includes('auth/invalid-credential'):
          case authError.includes('auth/invalid-email'):
          case authError.includes('auth/user-not-found'):
          case authError.includes('auth/wrong-password'):
            throw new Error('Correo o contraseña incorrectos');
          case authError.includes('auth/too-many-requests'):
            throw new Error('Demasiados intentos fallidos. Por favor, intente más tarde');
          case authError.includes('auth/network-request-failed'):
            throw new Error('Error de conexión. Por favor, verifique su conexión a internet');
          default:
            throw new Error(authError);
        }
      }

      if (!user) {
        throw new Error('No se pudo iniciar sesión');
      }
      
      login({
        id: user.uid,
        email: user.email || '',
        name: user.displayName || 'Usuario',
        role: 'admin'
      });
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-gray-600 hover:text-yellow-500 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Volver al Inicio</span>
          </Link>
          <div className="bg-yellow-500 p-3 rounded-full">
            <Lock className="h-6 w-6 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">
          Panel Administrativo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;