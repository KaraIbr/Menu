import { X, Plus, Minus, Trash2 } from 'lucide-react';
import useCartStore from '../../store/cartStore';

function CartDrawer({ isOpen, onClose, onConfirm }) {
  const { items, removeItem, updateCantidad, getTotal, getItemCount } = useCartStore();
  const total = getTotal();
  const itemCount = getItemCount();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-yuki-ink">Tu pedido</h2>
            <p className="text-sm text-yuki-muted">{itemCount} items</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-yuki-surface flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-yuki-ink" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-yuki-purple-light rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">🛒</span>
              </div>
              <h3 className="text-yuki-ink font-semibold text-lg mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-yuki-muted text-sm">
                Agrega productos para hacer tu pedido
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div 
                  key={index}
                  className="bg-yuki-surface rounded-2xl p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-yuki-ink">{item.product.nombre}</h4>
                    <button
                      onClick={() => removeItem(index)}
                      className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-red-50 transition-colors group"
                    >
                      <Trash2 className="w-4 h-4 text-yuki-muted group-hover:text-red-500" />
                    </button>
                  </div>
                  
                  {item.selected_modifiers.length > 0 && (
                    <div className="mb-2">
                      {item.selected_modifiers.map((mod, modIndex) => (
                        <p key={modIndex} className="text-xs text-yuki-muted">
                          • {mod.modifier.nombre}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {item.notas && (
                    <p className="text-xs text-yuki-muted italic mb-2">
                      "{item.notas}"
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCantidad(index, item.cantidad - 1)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-yuki-purple hover:text-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.cantidad}</span>
                      <button
                        onClick={() => updateCantidad(index, item.cantidad + 1)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-yuki-purple hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-bold text-yuki-purple">
                      ${(item.precio_unitario * item.cantidad).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-yuki-muted">Total</span>
              <span className="text-2xl font-bold text-yuki-purple">
                ${total.toFixed(2)}
              </span>
            </div>
            
            <button
              onClick={onConfirm}
              className="w-full py-4 bg-yuki-purple text-white rounded-full font-semibold text-lg hover:bg-yuki-purple-dark shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Confirmar pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
