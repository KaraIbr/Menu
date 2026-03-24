import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem('yuki_token') || null,
  user: null,
  isAuthenticated: !!localStorage.getItem('yuki_token'),
  
  login: (token, userData = null) => {
    localStorage.setItem('yuki_token', token);
    set({
      token,
      user: userData,
      isAuthenticated: true
    });
  },
  
  logout: () => {
    localStorage.removeItem('yuki_token');
    set({
      token: null,
      user: null,
      isAuthenticated: false
    });
  },
  
  getToken: () => get().token
}));

export default useAuthStore;
