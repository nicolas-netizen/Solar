import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
  login: (userData: { id: string; email: string; name: string; role: string; }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (userData) => set({ isAuthenticated: true, user: userData }),
      logout: () => {
        console.log('Logging out...');
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage), // Using sessionStorage instead of localStorage
      onRehydrateStorage: () => (state) => {
        console.log('Hydrated auth state:', state);
      },
    }
  )
);