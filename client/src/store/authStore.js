import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/client';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, user } = response.data;
          set({ token, user });
          // Set default auth header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          return { success: true };
        } catch (error) {
          return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
      },
      logout: () => {
        set({ user: null, token: null });
        delete api.defaults.headers.common['Authorization'];
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);