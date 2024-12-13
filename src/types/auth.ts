export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  version: number;
  login: (user: User) => void;
  logout: () => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}