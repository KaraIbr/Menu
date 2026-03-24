import { create } from 'zustand';

const calculateItemTotal = (product, selectedModifiers) => {
  const basePrice = parseFloat(product.precio_base);
  const extrasTotal = selectedModifiers.reduce((sum, mod) => {
    return sum + parseFloat(mod.precio_extra || 0);
  }, 0);
  return basePrice + extrasTotal;
};

const useCartStore = create((set, get) => ({
  items: [],
  tenantId: null,
  
  addItem: (product, selectedModifiers, notas = '') => {
    const precioUnitario = calculateItemTotal(product, selectedModifiers);
    const newItem = {
      product: {
        id: product.id,
        nombre: product.nombre,
        precio_base: product.precio_base,
        imagen: product.imagen
      },
      cantidad: 1,
      precio_unitario: precioUnitario,
      notas,
      selected_modifiers: selectedModifiers.map(mod => ({
        modifier: { id: mod.id, nombre: mod.nombre },
        precio_extra: mod.precio_extra
      }))
    };
    
    set((state) => ({
      items: [...state.items, newItem]
    }));
  },
  
  removeItem: (index) => {
    set((state) => ({
      items: state.items.filter((_, i) => i !== index)
    }));
  },
  
  updateCantidad: (index, cantidad) => {
    if (cantidad < 1) {
      get().removeItem(index);
      return;
    }
    set((state) => ({
      items: state.items.map((item, i) => 
        i === index ? { ...item, cantidad } : item
      )
    }));
  },
  
  clearCart: () => {
    set({ items: [], tenantId: null });
  },
  
  setTenantId: (id) => {
    set({ tenantId: id });
  },
  
  getTotal: () => {
    return get().items.reduce((sum, item) => {
      return sum + (item.precio_unitario * item.cantidad);
    }, 0);
  },
  
  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.cantidad, 0);
  }
}));

export default useCartStore;
