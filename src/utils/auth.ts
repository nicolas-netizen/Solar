import type { LoginCredentials } from '../types/auth';

// Simulated authentication - Replace with real API calls later
export const authenticateUser = async (credentials: LoginCredentials) => {
  // Simulated API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Demo credentials
  if (credentials.email === 'admin@nuevomundo.com' && credentials.password === 'admin123') {
    return {
      id: '1',
      email: credentials.email,
      name: 'Admin Usuario',
      role: 'admin' as const,
    };
  }

  throw new Error('Credenciales inválidas');
};