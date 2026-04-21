import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (username, password) => {
        try {
          const response = await api.post('/auth/personal/login/', { username, password });
          const userData = {
            id: response.data.id,
            username: response.data.username,
            nombre: response.data.nombre,
            rol: response.data.rol,
          };
          set({
            user: userData,
            isAuthenticated: true,
          });
          return userData;
        } catch (error) {
          return null;
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'yuki-auth',
    }
  )
);

export default useAuthStore;
