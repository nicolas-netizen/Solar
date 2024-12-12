export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
}