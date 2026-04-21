import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, SignOut, ArrowsClockwise, CurrencyDollar, Package, Users } from '@phosphor-icons/react';
import useAuthStore from '../store/authStore';
import { getMetrics } from '../services/api';
import toast from 'react-hot-toast';

const MetricCard = ({ title, value, icon: IconComponent, colorClass, subtitle }) => (
  <div className={`bento-card p-6 ${colorClass}`}>
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
        <IconComponent size={24} weight="duotone" />
      </div>
    </div>
    <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
    <p className="text-4xl font-bold">{value}</p>
    {subtitle && <p className="text-xs mt-2 opacity-60">{subtitle}</p>}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const personal_id = useAuthStore((state) => state.personal_id);
  
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const data = await getMetrics(personal_id);
      setMetrics(data);
    } catch (err) {
      toast.error('Error al cargar métricas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#3E3A36]/20 border-t-[#3E3A36] rounded-full animate-spin mx-auto mb-4" />
          <p className="font-medium text-[#3E3A36]/60">Cargando métricas...</p>
        </div>
      </div>
    );
  }

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
                Dashboard
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
              onClick={fetchMetrics}
              className="w-11 h-11 rounded-xl bg-white border border-[#3E3A36]/10 shadow-sm flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95"
            >
              <ArrowsClockwise size={22} className="text-[#3E3A36]" />
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

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Ventas del Día"
            value={formatCurrency(metrics?.ventas_dia || metrics?.total_ventas_dia || 0)}
            IconComponent={CurrencyDollar}
            colorClass="bg-[#E8E4DD] text-[#3E3A36]"
            subtitle="Actualizado hace un momento"
          />
          
          <MetricCard
            title="Pedidos Activos"
            value={metrics?.pedidos_activos || metrics?.ordenes_activas || 0}
            IconComponent={Package}
            colorClass="bg-[#D4E5D7] text-[#2D5A3D]"
            subtitle="En preparación y pendientes"
          />
          
          <MetricCard
            title="Personal en Turno"
            value={metrics?.personal_turno || metrics?.personal_en_turno || 0}
            IconComponent={Users}
            colorClass="bg-[#D9E2E9] text-[#2A4A6B]"
            subtitle="Miembros activos"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bento-card p-6 bg-white">
            <h3 className="font-semibold text-lg text-[#3E3A36] mb-4">
              Resumen de Hoy
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[#3E3A36]/5">
                <span className="text-[#3E3A36]/60">Pedidos Totales</span>
                <span className="font-semibold text-[#3E3A36]">
                  {metrics?.pedidos_totales || 0}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#3E3A36]/5">
                <span className="text-[#3E3A36]/60">Pedidos Entregados</span>
                <span className="font-semibold text-green-600">
                  {metrics?.pedidos_entregados || 0}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#3E3A36]/5">
                <span className="text-[#3E3A36]/60">Ticket Promedio</span>
                <span className="font-semibold text-[#3E3A36]">
                  {formatCurrency(metrics?.ticket_promedio || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[#3E3A36]/60">Tiempo Promedio</span>
                <span className="font-semibold text-[#3E3A36]">
                  {metrics?.tiempo_promedio_minutos ? `${metrics.tiempo_promedio_minutos} min` : '--'}
                </span>
              </div>
            </div>
          </div>

          <div className="bento-card p-6 bg-white">
            <h3 className="font-semibold text-lg text-[#3E3A36] mb-4">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/orders')}
                className="p-4 rounded-xl bg-[#F5F5F0] hover:bg-[#E8E4DD] transition-colors text-center"
              >
                <Package size={28} className="mx-auto mb-2 text-[#3E3A36]" />
                <span className="text-sm font-medium text-[#3E3A36]">Ver Pedidos</span>
              </button>
              <button
                onClick={() => navigate('/barista')}
                className="p-4 rounded-xl bg-[#F5F5F0] hover:bg-[#E8E4DD] transition-colors text-center"
              >
                <Users size={28} className="mx-auto mb-2 text-[#3E3A36]" />
                <span className="text-sm font-medium text-[#3E3A36]">Panel Barista</span>
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="p-4 rounded-xl bg-[#F5F5F0] hover:bg-[#E8E4DD] transition-colors text-center"
              >
                <CurrencyDollar size={28} className="mx-auto mb-2 text-[#3E3A36]" />
                <span className="text-sm font-medium text-[#3E3A36]">Administración</span>
              </button>
              <button
                onClick={fetchMetrics}
                className="p-4 rounded-xl bg-[#F5F5F0] hover:bg-[#E8E4DD] transition-colors text-center"
              >
                <ArrowsClockwise size={28} className="mx-auto mb-2 text-[#3E3A36]" />
                <span className="text-sm font-medium text-[#3E3A36]">Actualizar</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;