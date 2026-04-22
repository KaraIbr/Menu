import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.config?.skipErrorToast) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Error de conexion';
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
