import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = 'https://menu-ojc3.onrender.com/api';

let accessToken = localStorage.getItem('access');
let refreshToken = localStorage.getItem('refresh');

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const response = await axios.post(`${API_BASE}/auth/personal/login/`, {
          username: localStorage.getItem('username'),
          password: localStorage.getItem('password')
        });
        
        accessToken = response.data.access;
        refreshToken = response.data.refresh;
        localStorage.setItem('access', accessToken);
        localStorage.setItem('refresh', refreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    const message = error.response?.data?.detail || error.message || 'Error de conexión';
    toast.error(message);
    return Promise.reject(error);
  }
);

export const setTokens = (access, refresh, username, password) => {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
  localStorage.setItem('username', username);
  localStorage.setItem('password', password);
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('username');
  localStorage.removeItem('password');
};

export default api;
