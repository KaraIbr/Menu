import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, selectedModifiers = [], quantity = 1, notes = '') => {
        const modifierTotal = selectedModifiers.reduce(
          (sum, mod) => sum + parseFloat(mod.precio_extra || 0),
          0
        );
        const itemPrice = parseFloat(product.precio_base) + modifierTotal;
        
        const newItem = {
          id: Date.now(),
          product: {
            id: product.id,
            nombre: product.nombre,
            precio_base: product.precio_base,
            imagen: product.imagen,
          },
          selectedModifiers,
          quantity,
          notes,
          itemPrice,
          lineTotal: itemPrice * quantity,
        };
        
        set((state) => ({
          items: [...state.items, newItem],
        }));
      },
      
      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity, lineTotal: item.itemPrice * quantity }
              : item
          ),
        }));
      },
      
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.lineTotal, 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'yuki-cart',
    }
  )
);

export default useCartStore;
