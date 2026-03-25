import { useState } from 'react';
import { CreditCard, Banknote, QrCode, CheckCircle, Loader } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { createOrder } from '../../api/orders';

const paymentMethods = [
  { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
  { id: 'efectivo', label: 'Efectivo', icon: Banknote },
  { id: 'qr', label: 'Código QR', icon: QrCode },
];

function OrderConfirm({ isOpen, onClose, tenantId }) {
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [notas, setNotas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { items, getTotal, clearCart } = useCartStore();
  
  if (!isOpen) return null;
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const orderData = {
        tenant: tenantId || 1,
        metodo_pago: paymentMethod,
        notas,
        items: items.map(item => ({
          product: item.product.id,
          cantidad: item.cantidad,
          notas: item.notas,
          selected_modifiers: item.selected_modifiers.map(mod => ({
            modifier: mod.modifier.id,
            precio_extra: mod.precio_extra
          }))
        }))
      };
      
      const result = await createOrder(orderData);
      setOrderNumber(result.numero_orden);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Error al crear la orden:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    if (orderComplete) {
      setOrderComplete(false);
      setOrderNumber('');
      setNotas('');
      setPaymentMethod('tarjeta');
    }
    onClose();
  };
  
  if (orderComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        
        <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl text-center">
          <div className="w-24 h-24 bg-yuki-teal-light rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-yuki-teal" />
          </div>
          
          <h2 className="text-2xl font-semibold text-yuki-ink mb-2">
            ¡Pedido recibido!
          </h2>
          
          <p className="text-yuki-muted mb-4">
            Tu número de orden es
          </p>
          
          <div className="bg-yuki-purple text-white text-5xl font-bold py-6 px-8 rounded-2xl mb-6 inline-block">
            #{orderNumber}
          </div>
          
          <p className="text-yuki-muted mb-8">
            Te avisaremos cuando esté listo
          </p>
          
          <button
            onClick={handleClose}
            className="w-full py-4 bg-yuki-purple text-white rounded-full font-semibold text-lg hover:bg-yuki-purple-dark transition-colors"
          >
            Hacer otro pedido
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 bg-yuki-purple text-white">
          <h2 className="text-xl font-semibold">Confirmar pedido</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-yuki-ink mb-3">Resumen</h3>
            <div className="bg-yuki-surface rounded-xl p-4 space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-yuki-ink">
                    {item.cantidad}x {item.product.nombre}
                  </span>
                  <span className="text-yuki-muted">
                    ${(item.precio_unitario * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className="text-yuki-ink">Total</span>
                  <span className="text-yuki-purple">${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-yuki-ink mb-3">Método de pago</h3>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map(method => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'border-yuki-purple bg-yuki-purple-light'
                        : 'border-gray-200 hover:border-yuki-purple/50'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-yuki-purple' : 'text-yuki-muted'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-yuki-purple' : 'text-yuki-ink'}`}>
                      {method.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-yuki-ink mb-2">
              Notas del pedido
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: Sin hielo, para llevar..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-yuki-purple focus:outline-none transition-colors"
              rows={2}
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-yuki-teal text-white rounded-full font-semibold text-lg hover:bg-yuki-teal/90 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                Procesando...
              </>
            ) : (
              'Hacer pedido'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirm;
