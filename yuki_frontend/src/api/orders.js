import api from './axios';
import { mockOrders } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

let mockOrdersList = [...mockOrders];
let nextOrderId = 4;
let nextOrderNum = 4;

export const createOrder = async (orderData) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newOrder = {
      id: nextOrderId++,
      numero_orden: String(nextOrderNum++).padStart(3, '0'),
      estado: 'pendiente',
      tenant: orderData.tenant || 1,
      metodo_pago: orderData.metodo_pago,
      notas: orderData.notas || '',
      created_at: new Date().toISOString(),
      items: orderData.items.map((item, index) => ({
        id: 100 + index,
        product: { id: item.product, nombre: 'Producto' },
        cantidad: item.cantidad,
        notas: item.notas || '',
        selected_modifiers: item.selected_modifiers.map(mod => ({
          modifier: { id: mod.modifier, nombre: 'Modificador' },
          precio_extra: mod.precio_extra
        }))
      })),
      total: calculateTotal(orderData)
    };
    mockOrdersList.unshift(newOrder);
    return newOrder;
  }
  const response = await api.post('/orders/', orderData);
  return response.data;
};

export const getOrders = async (tenantSlug = 'yuki') => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockOrdersList;
  }
  const response = await api.get(`/orders/?tenant=${tenantSlug}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, newStatus) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const orderIndex = mockOrdersList.findIndex(o => o.id === parseInt(orderId));
    if (orderIndex !== -1) {
      mockOrdersList[orderIndex].estado = newStatus;
      return mockOrdersList[orderIndex];
    }
    throw new Error('Orden no encontrada');
  }
  const response = await api.patch(`/orders/${orderId}/estado/`, { estado: newStatus });
  return response.data;
};

export const loginBarista = async (email, password) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (email === 'barista@yuki.com' && password === 'yuki123') {
      return {
        access: 'mock_jwt_token_' + Date.now(),
        refresh: 'mock_refresh_token_' + Date.now()
      };
    }
    throw new Error('Credenciales inválidas');
  }
  const response = await api.post('/auth/token/', { email, password });
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  if (USE_MOCK) {
    return { access: 'mock_jwt_token_' + Date.now() };
  }
  const response = await api.post('/auth/token/refresh/', { refresh: refreshToken });
  return response.data;
};

function calculateTotal(orderData) {
  return '0.00';
}

export const getMockOrders = () => mockOrdersList;
