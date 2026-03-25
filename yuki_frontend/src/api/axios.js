import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = 'http://192.168.59.150:8000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'Error de conexión';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
