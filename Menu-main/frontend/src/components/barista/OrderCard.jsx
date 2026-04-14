const STATUS_CONFIG = {
  pendiente: {
    label: 'Pendiente',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-400',
  },
  preparando: {
    label: 'Preparando',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-400',
  },
  listo: {
    label: 'Listo',
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-400',
  },
  entregado: {
    label: 'Entregado',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-400',
  },
  cancelado: {
    label: 'Cancelado',
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-400',
  },
};

const PAYMENT_ICONS = {
  efectivo: '💵',
  tarjeta: '💳',
  qr: '📱',
};

const OrderCard = ({ order, onStatusChange }) => {
  const statusConfig = STATUS_CONFIG[order.estado] || STATUS_CONFIG.pendiente;
  const createdAt = new Date(order.created_at);
  const timeElapsed = Math.floor((Date.now() - createdAt.getTime()) / 60000);
  
  const nextStatus = {
    pendiente: 'preparando',
    preparando: 'listo',
    listo: 'entregado',
  };

  const handleAdvanceStatus = () => {
    const next = nextStatus[order.estado];
    if (next) {
      onStatusChange(order.id, next);
    }
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="font-fredoka font-bold text-3xl text-cobalt">
            #{order.numero_orden}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg">{PAYMENT_ICONS[order.metodo_pago]}</span>
            <span className="font-poppins text-sm text-ink/60">
              hace {timeElapsed} min
            </span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-fredoka font-semibold ${statusConfig.bg} ${statusConfig.text} border-2 ${statusConfig.border}`}>
          {statusConfig.label}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {order.items?.map((item, index) => (
          <div key={index} className="bg-paper rounded-xl p-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-fredoka font-semibold text-ink">
                  {item.cantidad}x {item.product?.nombre || 'Producto'}
                </span>
                {item.selected_modifiers?.length > 0 && (
                  <p className="font-poppins text-sm text-ink/60 mt-1">
                    {item.selected_modifiers.map((m) => m.nombre || m.modifier).join(', ')}
                  </p>
                )}
              </div>
              <span className="font-poppins font-medium text-ink">
                ${parseFloat(item.precio_unitario).toFixed(2)}
              </span>
            </div>
            {item.notas && (
              <p className="font-poppins text-sm text-cobalt italic mt-1">
                Nota: {item.notas}
              </p>
            )}
          </div>
        ))}
      </div>

      {order.notas && (
        <div className="bg-cobalt/5 rounded-xl p-3 mb-4">
          <p className="font-poppins text-sm text-ink">
            <span className="font-semibold">Notas:</span> {order.notas}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t-2 border-ink/10">
        <span className="font-fredoka font-bold text-xl text-ink">
          Total: ${parseFloat(order.total).toFixed(2)}
        </span>
        
        {nextStatus[order.estado] && (
          <button
            onClick={handleAdvanceStatus}
            className="bg-cobalt text-nano px-6 py-3 rounded-2xl font-fredoka font-semibold transition-all duration-150 active:scale-95"
          >
            {nextStatus[order.estado] === 'preparando' && 'Comenzar'}
            {nextStatus[order.estado] === 'listo' && 'Marcar listo'}
            {nextStatus[order.estado] === 'entregado' && 'Entregado'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
