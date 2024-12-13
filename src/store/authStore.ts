import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (userData) => set({ isAuthenticated: true, user: userData }),
      logout: () => {
        localStorage.removeItem('auth-storage');
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;