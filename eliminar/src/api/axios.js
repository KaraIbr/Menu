import axios from 'axios';

// Default to teammate's backend IP to avoid accidental localhost calls.
const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.59.150:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('yuki_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('yuki_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = API_URL.replace('/api', '');
  return `${baseUrl}${path}`;
};

export default api;
