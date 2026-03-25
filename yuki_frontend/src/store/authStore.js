import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, refreshToken } from '../api/menu';
import api from '../api/axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      login: async (username, password) => {
        try {
          const response = await apiLogin(username, password);
          set({
            accessToken: response.access,
            refreshToken: response.refresh,
            user: { username },
            isAuthenticated: true,
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${response.access}`;
          return true;
        } catch (error) {
          return false;
        }
      },
      
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        delete api.defaults.headers.common['Authorization'];
      },
      
      refreshAccessToken: async () => {
        const { refreshToken: refresh } = get();
        if (!refresh) return false;
        
        try {
          const response = await refreshToken(refresh);
          set({ accessToken: response.access });
          api.defaults.headers.common['Authorization'] = `Bearer ${response.access}`;
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },
      
      initializeAuth: () => {
        const { accessToken } = get();
        if (accessToken) {
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
      },
    }),
    {
      name: 'yuki-auth',
    }
  )
);

export default useAuthStore;
