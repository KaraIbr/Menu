import { useState, useMemo } from 'react';
import { X, Plus, Minus, Check } from '@phosphor-icons/react';
import { getFullImageUrl } from '../../api/menu';

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [selectedModifiers, setSelectedModifiers] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const modifierGroups = product.modifier_groups || [];

  const isValid = useMemo(() => {
    for (const group of modifierGroups) {
      if (group.requerido) {
        const selected = selectedModifiers[group.id]?.length || 0;
        if (selected < group.min_select) return false;
      }
    }
    return true;
  }, [modifierGroups, selectedModifiers]);

  const totalPrice = useMemo(() => {
    let total = parseFloat(product.precio_base);
    
    Object.values(selectedModifiers).forEach((mods) => {
      mods.forEach((mod) => {
        total += parseFloat(mod.precio_extra || 0);
      });
    });
    
    return total * quantity;
  }, [product.precio_base, selectedModifiers, quantity]);

  const toggleModifier = (groupId, modifier, maxSelect) => {
    setSelectedModifiers((prev) => {
      const current = prev[groupId] || [];
      const isSelected = current.some((m) => m.id === modifier.id);
      
      if (isSelected) {
        return {
          ...prev,
          [groupId]: current.filter((m) => m.id !== modifier.id),
        };
      }
      
      if (maxSelect === 1) {
        return {
          ...prev,
          [groupId]: [modifier],
        };
      }
      
      if (current.length < maxSelect) {
        return {
          ...prev,
          [groupId]: [...current, modifier],
        };
      }
      
      return prev;
    });
  };

  const handleAdd = () => {
    if (!isValid) return;
    
    const allModifiers = Object.values(selectedModifiers).flat();
    onAddToCart(product, allModifiers, quantity, notes);
    onClose();
  };

  const imageUrl = getFullImageUrl(product.imagen);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-paper w-full max-w-lg max-h-[90vh] rounded-t-4xl sm:rounded-3xl overflow-hidden flex flex-col">
        <div className="sticky top-0 z-10 flex justify-end p-4 bg-paper/95 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-nano border-2 border-ink shadow-doodle-sm flex items-center justify-center transition-all duration-150 active:scale-95 active:shadow-none"
          >
            <X size={24} weight="bold" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 pb-32">
          <div className="h-56 sm:h-72 bg-paper relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-nano flex items-center justify-center">
                <span className="font-fredoka text-4xl text-ink/20">Yuki</span>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <h2 className="font-fredoka font-bold text-3xl text-ink mb-2">
              {product.nombre}
            </h2>
            
            {product.descripcion && (
              <p className="font-poppins text-ink/70 mb-4">
                {product.descripcion}
              </p>
            )}
            
            <div className="space-y-6">
              {modifierGroups.map((group) => (
                <div key={group.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-fredoka font-semibold text-lg text-ink">
                      {group.nombre}
                    </h3>
                    {group.requerido && (
                      <span className="text-xs font-poppins font-medium text-nano bg-cobalt px-2 py-0.5 rounded-full">
                        Requerido
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {group.modifiers?.map((modifier) => {
                      const isSelected = (selectedModifiers[group.id] || []).some(
                        (m) => m.id === modifier.id
                      );
                      
                      return (
                        <button
                          key={modifier.id}
                          onClick={() => toggleModifier(group.id, modifier, group.max_select)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-150 touch-target ${
                            isSelected
                              ? 'bg-cobalt/10 border-cobalt'
                              : 'bg-nano border-ink/20 active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-cobalt border-cobalt'
                                  : 'border-ink/30'
                              }`}
                            >
                              {isSelected && (
                                <Check size={14} weight="bold" className="text-nano" />
                              )}
                            </div>
                            <span className="font-poppins font-medium text-ink">
                              {modifier.nombre}
                            </span>
                          </div>
                          
                          {parseFloat(modifier.precio_extra) > 0 && (
                            <span className="font-poppins font-semibold text-cobalt">
                              +${parseFloat(modifier.precio_extra).toFixed(2)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              <div>
                <h3 className="font-fredoka font-semibold text-lg text-ink mb-3">
                  Notas (opcional)
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Sin hielo, extra caliente..."
                  className="w-full p-4 bg-nano rounded-2xl border-2 border-ink/20 font-poppins text-ink placeholder:text-ink/40 resize-none focus:outline-none focus:border-cobalt"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 z-10 bg-paper/95 backdrop-blur-sm border-t-2 border-ink/10 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-full bg-nano border-2 border-ink shadow-doodle-sm flex items-center justify-center transition-all duration-150 active:scale-95 active:shadow-none"
              >
                <Minus size={20} weight="bold" />
              </button>
              <span className="font-fredoka font-bold text-2xl text-ink w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-full bg-nano border-2 border-ink shadow-doodle-sm flex items-center justify-center transition-all duration-150 active:scale-95 active:shadow-none"
              >
                <Plus size={20} weight="bold" />
              </button>
            </div>
            
            <div className="text-right">
              <p className="font-fredoka font-bold text-3xl text-cobalt">
                ${totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleAdd}
            disabled={!isValid}
            className={`w-full py-4 rounded-2xl font-fredoka font-bold text-xl transition-all duration-150 touch-target ${
              isValid
                ? 'bg-cobalt text-nano border-2 border-ink shadow-doodle active:scale-95 active:shadow-none'
                : 'bg-ink/20 text-ink/40 cursor-not-allowed'
            }`}
          >
            {!isValid ? 'Completa las opciones requeridas' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
