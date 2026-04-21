import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { personalLogin } from '../api/menu';
import api from '../api/axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (username, password) => {
        try {
          const response = await personalLogin(username, password);
          const { access, id, nombre, username: uname, rol } = response;
          set({
            accessToken: access,
            user: { id, username: uname, nombre, rol },
            isAuthenticated: true,
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          return response;
        } catch (error) {
          return null;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
        delete api.defaults.headers.common['Authorization'];
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
