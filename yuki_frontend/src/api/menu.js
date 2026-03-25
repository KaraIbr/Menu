import api from './axios';

export const getMenu = async () => {
  const response = await api.get('/menu/');
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/menu/categories/');
  return response.data;
};

export const getProducts = async (params = {}) => {
  const response = await api.get('/menu/products/', { params });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/menu/products/${id}/`);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await api.post('/orders/', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders/');
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}/`);
  return response.data;
};

export const updateOrderStatus = async (id, estado) => {
  const response = await api.patch(`/orders/${id}/estado/`, { estado });
  return response.data;
};

export const login = async (username, password) => {
  const response = await api.post('/auth/token/', { username, password });
  return response.data;
};

export const refreshToken = async (refresh) => {
  const response = await api.post('/auth/token/refresh/', { refresh });
  return response.data;
};

export const getFullImageUrl = (relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http')) return relativePath;
  return `http://192.168.59.150:8000${relativePath}`;
};
