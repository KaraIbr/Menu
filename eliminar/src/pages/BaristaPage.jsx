import { useNavigate } from 'react-router-dom';
import { LogOut, RefreshCw } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import OrderList from '../components/barista/OrderList';
import useOrders from '../hooks/useOrders';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

function BaristaPage() {
  const navigate = useNavigate();
  const { orders, loading, error, refetch, changeStatus } = useOrders('yuki', true);
  const { logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleAdvanceStatus = async (orderId, newStatus) => {
    const success = await changeStatus(orderId, newStatus);
    if (success) {
      toast.success('Estado actualizado');
    } else {
      toast.error('Error al actualizar');
    }
  };
  
  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-yuki-surface flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando órdenes..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-yuki-surface">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-yuki-ink">Panel de Órdenes</h1>
            <p className="text-yuki-muted text-sm">
              {orders.length} órdenes activas
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={refetch}
              className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              title="Actualizar"
            >
              <RefreshCw className="w-5 h-5 text-yuki-purple" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-yuki-ink"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}
        
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-yuki-purple-light rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h2 className="text-xl font-semibold text-yuki-ink mb-2">
              No hay órdenes
            </h2>
            <p className="text-yuki-muted">
              Las órdenes aparecerán aquí cuando se realicen desde el kiosk
            </p>
          </div>
        ) : (
          <OrderList
            orders={orders}
            onAdvanceStatus={handleAdvanceStatus}
          />
        )}
      </div>
    </div>
  );
}

export default BaristaPage;
