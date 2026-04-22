import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

const normalizeUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    nombre: user.nombre,
    username: user.username,
    rol: user.rol,
  };
};

const getAuthState = (user) => ({
  user,
  isAuthenticated: Boolean(user),
});

const useAuthStore = create(
  persist(
    (set, get) => ({
      ...getAuthState(null),

      initializeAuth: () => {
        const user = normalizeUser(get().user);
        set(getAuthState(user));
      },

      login: async (username, password) => {
        try {
          const response = await api.post(
            '/auth/personal/login/',
            { username, password },
            { skipErrorToast: true }
          );

          const user = normalizeUser(response.data);
          set(getAuthState(user));
          return user;
        } catch (error) {
          return null;
        }
      },

      logout: () => {
        set(getAuthState(null));
      },
    }),
    {
      name: 'yuki-auth',
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.initializeAuth?.();
      },
    }
  )
);

export default useAuthStore;
