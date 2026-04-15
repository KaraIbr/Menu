import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { personalLogin, refreshToken } from '../api/menu';
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
          const response = await personalLogin(username, password);
          set({
            accessToken: 'personal-token',
            refreshToken: null,
            user: { 
              id: response.id,
              username: response.username, 
              nombre: response.nombre,
              rol: response.rol,
            },
            isAuthenticated: true,
          });
          api.defaults.headers.common['Authorization'] = 'Bearer personal-token';
          return response;
        } catch (error) {
          return null;
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
        return true;
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
