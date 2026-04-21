import api from '../api/axios';

export const getMetrics = async (sucursalId = null) => {
  const endpoint = sucursalId ? `/metrics/?sucursal=${sucursalId}` : '/metrics/';
  const response = await api.get(endpoint);
  return response.data;
};

export const getDailySales = async (fecha = null) => {
  const params = fecha ? { fecha } : {};
  const response = await api.get('/metrics/ventas-diarias/', { params });
  return response.data;
};

export const getActiveOrders = async () => {
  const response = await api.get('/metrics/pedidos-activos/');
  return response.data;
};

export const getPersonalOnShift = async () => {
  const response = await api.get('/metrics/personal-turno/');
  return response.data;
};