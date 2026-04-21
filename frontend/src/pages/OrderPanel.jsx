import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, SignOut, ArrowsClockwise, Clock, CheckCircle, BowlFood, Timer } from '@phosphor-icons/react';
import useAuthStore from '../store/authStore';
import { getOrders, updateOrderStatus } from '../api/menu';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
  const styles = {
    pendiente: 'bg-[#FEF3C7] text-[#92400E]',
    preparando: 'bg-[#DBEAFE] text-[#1E40AF]',
    listo: 'bg-[#D1FAE5] text-[#065F46]',
    entregado: 'bg-[#E5E7EB] text-[#374151]',
    cancelado: 'bg-[#FEE2E2] text-[#991B1B]',
  };

  const labels = {
    pendiente: 'Pendiente',
    preparando: 'Preparando',
    listo: 'Listo',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pendiente}`}>
      {labels[status] || status}
    </span>
  );
};

const OrderItem = ({ order, onStatusChange }) => {
  const getNextStatus = (current) => {
    const flow = { pendiente: 'preparando', preparando: 'listo', listo: 'entregado' };
    return flow[current];
  };

  const nextStatus = getNextStatus(order.estado);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#3E3A36]/5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#3E3A36]">#{order.numero_orden || order.id}</span>
          <span className="text-[#3E3A36]/50">•</span>
          <span className="text-sm text-[#3E3A36]/60">Mesa {order.mesa || 'Mostrador'}</span>
        </div>
        <StatusBadge status={order.estado} />
      </div>

      <div className="space-y-2 mb-4">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-[#3E3A36]">
              {item.cantidad}x {item.producto || item.nombre || 'Producto'}
            </span>
            {item.notas && <span className="text-[#3E3A36]/50 text-xs italic">{item.notas}</span>}
          </div>
        ))}
      </div>

      {order.total && (
        <div className="border-t border-[#3E3A36]/5 pt-3 mb-3">
          <div className="flex justify-between font-semibold text-[#3E3A36]">
            <span>Total</span>
            <span>${parseFloat(order.total).toFixed(2)}</span>
          </div>
        </div>
      )}

      {nextStatus && order.estado !== 'entregado' && (
        <button
          onClick={() => onStatusChange(order.id, nextStatus)}
          className="w-full py-2.5 rounded-lg bg-[#3E3A36] text-white font-medium text-sm hover:bg-[#2D2A26] transition-colors flex items-center justify-center gap-2"
        >
          {nextStatus === 'preparando' && <BowlFood size={18} />}
          {nextStatus === 'listo' && <CheckCircle size={18} />}
          {nextStatus === 'entregado' && <Timer size={18} />}
          Marcar como {nextStatus}
        </button>
      )}
    </div>
  );
};

const OrderColumn = ({ title, orders, onStatusChange, color }) => (
  <div className="flex flex-col h-full">
    <div className={`flex items-center gap-2 mb-4 pb-3 border-b-2`} style={{ borderColor: color }}>
      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
      <h2 className="font-semibold text-[#3E3A36]">
        {title} <span className="text-[#3E3A36]/50">({orders.length})</span>
      </h2>
    </div>
    <div className="space-y-4 flex-1 overflow-y-auto">
      {orders.length === 0 ? (
        <p className="text-center text-[#3E3A36]/30 py-8 text-sm">Sin pedidos</p>
      ) : (
        orders.map((order) => (
          <OrderItem key={order.id} order={order} onStatusChange={onStatusChange} />
        ))
      )}
    </div>
  </div>
);

const OrderPanel = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      toast.success(`Pedido #${updated.numero_orden} → ${newStatus}`);
    } catch {
      toast.error('Error al actualizar estado');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeOrders = orders.filter((o) => !['entregado', 'cancelado'].includes(o.estado));

  const groupedOrders = {
    pendiente: activeOrders.filter((o) => o.estado === 'pendiente'),
    preparando: activeOrders.filter((o) => o.estado === 'preparando'),
    listo: activeOrders.filter((o) => o.estado === 'listo'),
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <header className="sticky top-0 z-40 bg-[#F5F5F0]/90 backdrop-blur-md border-b border-[#3E3A36]/10 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="w-11 h-11 rounded-xl bg-white border border-[#3E3A36]/10 shadow-sm flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={22} weight="bold" className="text-[#3E3A36]" />
            </button>
            <div>
              <h1 className="font-semibold text-xl text-[#3E3A36]">
                Panel de Pedidos
              </h1>
              {user?.nombre && (
                <p className="text-sm text-[#3E3A36]/50">
                  {user.nombre}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="w-11 h-11 rounded-xl bg-white border border-[#3E3A36]/10 shadow-sm flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95"
            >
              <ArrowsClockwise size={22} className={`text-[#3E3A36] ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="w-11 h-11 rounded-xl bg-white border border-[#3E3A36]/10 shadow-sm flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95"
            >
              <SignOut size={22} className="text-[#3E3A36]" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 h-[calc(100vh-85px)]">
        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#3E3A36]/20 border-t-[#3E3A36] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#3E3A36]/60">Cargando pedidos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button onClick={fetchOrders} className="px-4 py-2 bg-[#3E3A36] text-white rounded-lg">
                Reintentar
              </button>
            </div>
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Clock size={48} className="mx-auto mb-4 text-[#3E3A36]/20" />
              <p className="font-medium text-[#3E3A36]/40">No hay pedidos activos</p>
              <p className="text-sm text-[#3E3A36]/30 mt-1">Los nuevos pedidos aparecerán aquí</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <OrderColumn
              title="Pendientes"
              orders={groupedOrders.pendiente}
              onStatusChange={handleStatusChange}
              color="#F59E0B"
            />
            <OrderColumn
              title="Preparando"
              orders={groupedOrders.preparando}
              onStatusChange={handleStatusChange}
              color="#3B82F6"
            />
            <OrderColumn
              title="Listos"
              orders={groupedOrders.listo}
              onStatusChange={handleStatusChange}
              color="#10B981"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderPanel;