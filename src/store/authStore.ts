import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { migrations, version } from './migrations';
import type { AuthState } from '../types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      version: version,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'auth-storage',
      version: version,
      migrate: (persistedState: any, version: number) => {
        if (persistedState._hasHydrated) {
          return persistedState;
        }
        
        let state = persistedState;
        
        // Apply each migration sequentially
        for (let v = state.version || 0; v < version; v++) {
          if (migrations[v]) {
            state = migrations[v](state);
          }
        }
        
        return state;
      },
    }
  )
);