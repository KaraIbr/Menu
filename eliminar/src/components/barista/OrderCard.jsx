import { Clock, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

function OrderCard({ order, onAdvanceStatus }) {
  const getTimeElapsed = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Hace un momento';
    if (diffMins === 1) return 'Hace 1 min';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    
    const hours = Math.floor(diffMins / 60);
    return `Hace ${hours}h ${diffMins % 60}m`;
  };
  
  const getNextStatus = (currentStatus) => {
    const flow = ['pendiente', 'preparando', 'listo', 'entregado'];
    const currentIndex = flow.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex >= flow.length - 1) return null;
    return flow[currentIndex + 1];
  };
  
  const nextStatus = getNextStatus(order.estado);
  
  const getNextStatusLabel = (status) => {
    const labels = {
      preparando: 'Empezar',
      listo: 'Marcar listo',
      entregado: 'Entregado'
    };
    return labels[status] || 'Siguiente';
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-yuki-purple">
            #{order.numero_orden}
          </span>
          <StatusBadge status={order.estado} />
        </div>
        <div className="flex items-center gap-1 text-yuki-muted text-xs">
          <Clock className="w-3 h-3" />
          {getTimeElapsed(order.created_at)}
        </div>
      </div>
      
      <div className="space-y-1">
        {order.items.map((item, index) => (
          <div key={index} className="text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-yuki-purple text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {item.cantidad}
              </span>
              <span className="font-medium text-yuki-ink">{item.product.nombre}</span>
            </div>
            {item.selected_modifiers.length > 0 && (
              <div className="ml-8 text-xs text-yuki-muted">
                {item.selected_modifiers.map((mod, modIndex) => (
                  <span key={modIndex}>
                    {mod.modifier.nombre}
                    {modIndex < item.selected_modifiers.length - 1 && ' • '}
                  </span>
                ))}
              </div>
            )}
            {item.notas && (
              <p className="ml-8 text-xs text-yuki-muted italic">"{item.notas}"</p>
            )}
          </div>
        ))}
      </div>
      
      {order.notas && (
        <div className="text-xs text-yuki-muted italic bg-yuki-surface p-2 rounded-lg">
          Nota: {order.notas}
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-sm text-yuki-muted">
          {order.metodo_pago.charAt(0).toUpperCase() + order.metodo_pago.slice(1)}
        </span>
        <span className="font-bold text-yuki-purple">${parseFloat(order.total).toFixed(2)}</span>
      </div>
      
      {nextStatus && order.estado !== 'entregado' && order.estado !== 'cancelado' && (
        <button
          onClick={() => onAdvanceStatus(order.id, nextStatus)}
          className="w-full py-3 bg-yuki-purple text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-yuki-purple-dark transition-colors"
        >
          {getNextStatusLabel(nextStatus)}
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
      
      {(order.estado === 'entregado' || order.estado === 'cancelado') && (
        <button
          onClick={() => onAdvanceStatus(order.id, 'cancelado')}
          className="w-full py-2 text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          {order.estado === 'entregado' ? 'Ocultar' : 'Eliminar'}
        </button>
      )}
    </div>
  );
}

export default OrderCard;
