import { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { getMediaUrl } from '../../api/axios';
import useCartStore from '../../store/cartStore';

function ProductModal({ product, isOpen, onClose }) {
  const [selectedModifiers, setSelectedModifiers] = useState({});
  const [notas, setNotas] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  
  useEffect(() => {
    if (isOpen) {
      setSelectedModifiers({});
      setNotas('');
    }
  }, [isOpen, product]);
  
  if (!isOpen || !product) return null;
  
  const basePrice = parseFloat(product.precio_base);
  
  const calculateTotal = () => {
    const extrasTotal = Object.values(selectedModifiers).flat().reduce((sum, mod) => {
      return sum + parseFloat(mod.precio_extra || 0);
    }, 0);
    return basePrice + extrasTotal;
  };
  
  const isRequiredGroupsComplete = () => {
    if (!product.modifier_groups) return true;
    return product.modifier_groups.every(group => {
      if (!group.requerido) return true;
      const selected = selectedModifiers[group.id] || [];
      return selected.length >= group.min_select;
    });
  };
  
  const canAdd = isRequiredGroupsComplete();
  
  const handleModifierChange = (group, modifier, isSingleSelect) => {
    setSelectedModifiers(prev => {
      const current = prev[group.id] || [];
      
      if (isSingleSelect) {
        return {
          ...prev,
          [group.id]: [modifier]
        };
      }
      
      const isSelected = current.some(m => m.id === modifier.id);
      if (isSelected) {
        return {
          ...prev,
          [group.id]: current.filter(m => m.id !== modifier.id)
        };
      }
      
      if (group.max_select && current.length >= group.max_select) {
        return prev;
      }
      
      return {
        ...prev,
        [group.id]: [...current, modifier]
      };
    });
  };
  
  const isModifierSelected = (groupId, modifierId) => {
    const group = selectedModifiers[groupId] || [];
    return group.some(m => m.id === modifierId);
  };
  
  const handleAddToCart = () => {
    if (!canAdd) return;
    
    setIsAdding(true);
    
    const allSelectedModifiers = Object.values(selectedModifiers).flat();
    
    addItem(product, allSelectedModifiers, notas);
    
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 300);
  };
  
  const total = calculateTotal();
  const imageUrl = getMediaUrl(product.imagen);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-yuki-ink" />
        </button>
        
        <div className="aspect-video bg-yuki-surface relative overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yuki-purple-light to-yuki-teal-light">
              <span className="text-6xl">🍵</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-yuki-ink mb-2">
              {product.nombre}
            </h2>
            {product.descripcion && (
              <p className="text-yuki-muted leading-relaxed">
                {product.descripcion}
              </p>
            )}
            <p className="text-yuki-purple font-bold text-xl mt-3">
              ${basePrice.toFixed(2)}
            </p>
          </div>
          
          {product.modifier_groups && product.modifier_groups.length > 0 && (
            <div className="space-y-6">
              {product.modifier_groups.map(group => (
                <div key={group.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-yuki-ink">
                      {group.nombre}
                    </h3>
                    {group.requerido && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        Requerido
                      </span>
                    )}
                    {group.max_select > 1 && (
                      <span className="text-xs text-yuki-muted">
                        (Selecciona hasta {group.max_select})
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {group.modifiers.map(modifier => {
                      const isSelected = isModifierSelected(group.id, modifier.id);
                      const isSingleSelect = group.max_select === 1;
                      const extraPrice = parseFloat(modifier.precio_extra);
                      
                      return (
                        <button
                          key={modifier.id}
                          onClick={() => handleModifierChange(group, modifier, isSingleSelect)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-yuki-purple bg-yuki-purple-light text-yuki-purple'
                              : 'border-gray-200 bg-white text-yuki-ink hover:border-yuki-purple/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-yuki-purple bg-yuki-purple'
                                : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <span className="font-medium">{modifier.nombre}</span>
                          </div>
                          {extraPrice > 0 && (
                            <span className="text-sm text-yuki-muted">
                              +${extraPrice.toFixed(2)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-yuki-ink mb-2">
              Notas especiales
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: Sin hielo, extra dulce..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-yuki-purple focus:outline-none transition-colors"
              rows={2}
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-yuki-muted">Total</span>
            <span className="text-2xl font-bold text-yuki-purple">
              ${total.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!canAdd || isAdding}
            className={`w-full py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
              canAdd && !isAdding
                ? 'bg-yuki-purple text-white hover:bg-yuki-purple-dark shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isAdding ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-6 h-6" />
                Agregar al carrito
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
