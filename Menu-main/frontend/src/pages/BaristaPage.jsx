import { useNavigate } from 'react-router-dom';
import { ArrowLeft, SignOut, ArrowsClockwise } from '@phosphor-icons/react';
import useOrders from '../hooks/useOrders';
import useAuthStore from '../store/authStore';
import OrderCard from '../components/barista/OrderCard';
import { updateOrderStatus } from '../api/menu';
import toast from 'react-hot-toast';

const BaristaPage = () => {
  const navigate = useNavigate();
  const { orders, loading, error, refetch, updateOrderInList } = useOrders();
  const logout = useAuthStore((state) => state.logout);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      updateOrderInList(updated);
      toast.success(`Pedido #${updated.numero_orden} -> ${newStatus}`);
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeOrders = orders.filter(
    (o) => !['entregado', 'cancelado'].includes(o.estado)
  );

  const groupedOrders = {
    pendiente: activeOrders.filter((o) => o.estado === 'pendiente'),
    preparando: activeOrders.filter((o) => o.estado === 'preparando'),
    listo: activeOrders.filter((o) => o.estado === 'listo'),
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 bg-paper border-b-2 border-ink px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="w-12 h-12 rounded-full bg-nano border-2 border-ink shadow-doodle-sm flex items-center justify-center transition-all duration-150 active:scale-95 active:shadow-none"
            >
              <ArrowLeft size={24} weight="bold" />
            </button>
            <h1 className="font-fredoka font-bold text-2xl text-cobalt">
              Panel Barista
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={refetch}
              className="w-12 h-12 rounded-full bg-nano border-2 border-ink shadow-doodle-sm flex items-center justify-center transition-all duration-150 active:scale-95 active:shadow-none"
            >
              <ArrowsClockwise size={24} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleLogout}
              className="w-12 h-12 rounded-full bg-nano border-2 border-ink shadow-doodle-sm flex items-center justify-center transition-all duration-150 active:scale-95 active:shadow-none"
            >
              <SignOut size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {loading && orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-poppins text-ink/60">Cargando pedidos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="font-poppins text-red-600 mb-4">{error}</p>
            <button onClick={refetch} className="btn-secondary">
              Reintentar
            </button>
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-fredoka font-semibold text-2xl text-ink/40 mb-2">
              No hay pedidos activos
            </p>
            <p className="font-poppins text-ink/60">
              Los nuevos pedidos aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section>
              <h2 className="font-fredoka font-bold text-xl text-yellow-700 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                Pendientes ({groupedOrders.pendiente.length})
              </h2>
              <div className="space-y-4">
                {groupedOrders.pendiente.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-fredoka font-bold text-xl text-blue-700 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                Preparando ({groupedOrders.preparando.length})
              </h2>
              <div className="space-y-4">
                {groupedOrders.preparando.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-fredoka font-bold text-xl text-green-700 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                Listos ({groupedOrders.listo.length})
              </h2>
              <div className="space-y-4">
                {groupedOrders.listo.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default BaristaPage;
