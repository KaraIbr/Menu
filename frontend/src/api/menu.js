import api from './axios';

const API_URL = 'https://menu-ojc3.onrender.com/api';

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
  const response = await api.get('/orders/list');
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

export const personalLogin = async (username, password) => {
  const response = await api.post('/auth/personal/login/', { username, password });
  return response.data;
};

export const getFullImageUrl = (relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http')) return relativePath;
  return `https://menu-ojc3.onrender.com${relativePath}`;
};

export const getPersonalList = async () => {
  const response = await api.get('/admin/personal/');
  return response.data;
};

export const createPersonal = async (data) => {
  const response = await api.post('/admin/personal/', data);
  return response.data;
};

export const updatePersonal = async (id, data) => {
  const response = await api.patch(`/admin/personal/${id}/`, data);
  return response.data;
};

export const deletePersonal = async (id) => {
  await api.delete(`/admin/personal/${id}/`);
};

export const getCategoriesAdmin = async () => {
  const response = await api.get('/admin/categories/');
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post('/admin/categories/', data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.patch(`/admin/categories/${id}/`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  await api.delete(`/admin/categories/${id}/`);
};

export const getProductsAdmin = async (params = {}) => {
  const response = await api.get('/admin/products/', { params });
  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post('/admin/products/', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.patch(`/admin/products/${id}/`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/admin/products/${id}/`);
};