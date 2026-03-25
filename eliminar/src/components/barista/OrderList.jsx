import OrderCard from './OrderCard';

const columns = [
  { key: 'pendiente', label: 'Pendiente', color: 'amber' },
  { key: 'preparando', label: 'Preparando', color: 'blue' },
  { key: 'listo', label: 'Listo', color: 'teal' },
];

function OrderList({ orders, onAdvanceStatus }) {
  const ordersByStatus = {
    pendiente: orders.filter(o => o.estado === 'pendiente'),
    preparando: orders.filter(o => o.estado === 'preparando'),
    listo: orders.filter(o => o.estado === 'listo'),
  };
  
  const colorMap = {
    amber: 'border-amber-400',
    blue: 'border-blue-400',
    teal: 'border-yuki-teal',
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {columns.map(column => (
        <div key={column.key} className="space-y-4">
          <div className={`flex items-center gap-2 pb-3 border-b-2 ${colorMap[column.color]}`}>
            <h2 className="font-semibold text-yuki-ink text-lg">
              {column.label}
            </h2>
            <span className="bg-yuki-surface px-2 py-0.5 rounded-full text-sm font-medium text-yuki-muted">
              {ordersByStatus[column.key].length}
            </span>
          </div>
          
          <div className="space-y-4 min-h-[200px]">
            {ordersByStatus[column.key].length === 0 ? (
              <div className="text-center py-8 text-yuki-muted text-sm">
                No hay órdenes
              </div>
            ) : (
              ordersByStatus[column.key].map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAdvanceStatus={onAdvanceStatus}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderList;
