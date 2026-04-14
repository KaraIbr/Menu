import { useState } from 'react';
import { X, Plus, Minus, Trash, CreditCard, Money, QrCode } from '@phosphor-icons/react';
import useCartStore from '../../store/cartStore';
import { createOrder } from '../../api/menu';
import toast from 'react-hot-toast';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const total = getTotal();

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast.error('Selecciona un método de pago');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        metodo_pago: paymentMethod,
        notas: notes,
        items: items.map((item) => ({
          product: item.product.id,
          cantidad: item.quantity,
          notas: item.notes,
          selected_modifiers: item.selectedModifiers.map((mod) => ({
            modifier: mod.id,
            precio_extra: mod.precio_extra,
          })),
        })),
      };

      const order = await createOrder(orderData);
      setOrderComplete(order);
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewOrder = () => {
    setOrderComplete(null);
    setShowCheckout(false);
    setPaymentMethod('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  if (orderComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-paper rounded-3xl border-2 border-ink shadow-doodle p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-cobalt/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="font-fredoka font-bold text-5xl text-cobalt">
              #{orderComplete.numero_orden}
            </span>
          </div>
          <h2 className="font-fredoka font-bold text-3xl text-ink mb-2">
            ¡Pedido recibido!
          </h2>
          <p className="font-poppins text-ink/70 mb-6">
            Tu pedido #{orderComplete.numero_orden} está siendo procesado.
          </p>
          <button
            onClick={handleNewOrder}
            className="btn-primary w-full"
          >
            Hacer otro pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-paper w-full max-w-md h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b-2 border-ink/10">
          <h2 className="font-fredoka font-bold text-2xl text-ink">
            {showCheckout ? 'Confirmar pedido' : 'Tu carrito'}
          </h2>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-nano border-2 border-ink shadow-doodle-sm flex items-center justify-center transition-all duration-150 active:scale-95 active:shadow-none"
          >
            <X size={24} weight="bold" />
          </button>
        </div>

        {!showCheckout ? (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="font-poppins text-ink/60 mb-4">
                    Tu carrito está vacío
                  </p>
                  <button onClick={onClose} className="btn-secondary">
                    Ver productos
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="card">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-fredoka font-semibold text-lg text-ink">
                            {item.product.nombre}
                          </h3>
                          {item.selectedModifiers.length > 0 && (
                            <p className="font-poppins text-sm text-ink/60">
                              {item.selectedModifiers.map((m) => m.nombre).join(', ')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-10 h-10 rounded-full bg-paper border-2 border-ink/20 flex items-center justify-center transition-all duration-150 active:scale-95"
                        >
                          <Trash size={18} weight="bold" className="text-ink/60" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-10 h-10 rounded-full bg-paper border-2 border-ink/20 flex items-center justify-center transition-all duration-150 active:scale-95"
                          >
                            <Minus size={16} weight="bold" />
                          </button>
                          <span className="font-fredoka font-bold text-lg w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 rounded-full bg-paper border-2 border-ink/20 flex items-center justify-center transition-all duration-150 active:scale-95"
                          >
                            <Plus size={16} weight="bold" />
                          </button>
                        </div>
                        <span className="font-fredoka font-bold text-lg text-cobalt">
                          ${item.lineTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t-2 border-ink/10 bg-paper">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-fredoka font-semibold text-xl text-ink">
                    Total
                  </span>
                  <span className="font-fredoka font-bold text-3xl text-cobalt">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="btn-primary w-full"
                >
                  Confirmar pedido
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="card mb-4">
                <h3 className="font-fredoka font-semibold text-lg text-ink mb-3">
                  Resumen del pedido
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="font-poppins text-ink/70">
                        {item.quantity}x {item.product.nombre}
                      </span>
                      <span className="font-poppins font-medium text-ink">
                        ${item.lineTotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-ink/10 mt-3 pt-3 flex justify-between">
                  <span className="font-fredoka font-semibold text-ink">Total</span>
                  <span className="font-fredoka font-bold text-cobalt">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-fredoka font-semibold text-lg text-ink mb-3">
                  Método de pago
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'efectivo', icon: Money, label: 'Efectivo' },
                    { id: 'tarjeta', icon: CreditCard, label: 'Tarjeta' },
                    { id: 'qr', icon: QrCode, label: 'QR' },
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setPaymentMethod(id)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-150 flex flex-col items-center gap-2 touch-target ${
                        paymentMethod === id
                          ? 'bg-cobalt/10 border-cobalt'
                          : 'bg-nano border-ink/20 active:scale-95'
                      }`}
                    >
                      <Icon size={28} weight={paymentMethod === id ? 'fill' : 'regular'} className={paymentMethod === id ? 'text-cobalt' : 'text-ink/60'} />
                      <span className="font-poppins text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-fredoka font-semibold text-lg text-ink mb-3">
                  Notas del pedido
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instrucciones especiales..."
                  className="w-full p-4 bg-nano rounded-2xl border-2 border-ink/20 font-poppins text-ink placeholder:text-ink/40 resize-none focus:outline-none focus:border-cobalt"
                  rows={2}
                />
              </div>
            </div>

            <div className="p-4 border-t-2 border-ink/10 bg-paper">
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
              </button>
              <button
                onClick={() => setShowCheckout(false)}
                className="w-full mt-3 font-poppins font-medium text-ink/60 py-2"
              >
                Volver al carrito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
