const statusConfig = {
  pendiente: {
    label: 'Pendiente',
    className: 'bg-amber-100 text-amber-800'
  },
  preparando: {
    label: 'Preparando',
    className: 'bg-blue-100 text-blue-800'
  },
  listo: {
    label: 'Listo',
    className: 'bg-yuki-teal-light text-yuki-teal'
  },
  entregado: {
    label: 'Entregado',
    className: 'bg-gray-100 text-gray-600'
  },
  cancelado: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-700'
  }
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pendiente;
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export default StatusBadge;
