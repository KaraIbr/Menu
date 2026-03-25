import api from './axios';
import { mockMenu } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const getMenu = async (slug = 'yuki') => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMenu;
  }
  const response = await api.get(`/menu/${slug}/`);
  return response.data;
};

export const getProduct = async (productId) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    for (const category of mockMenu.categories) {
      const product = category.products.find(p => p.id === parseInt(productId));
      if (product) return product;
    }
    throw new Error('Producto no encontrado');
  }
  const response = await api.get(`/menu/yuki/products/${productId}/`);
  return response.data;
};
