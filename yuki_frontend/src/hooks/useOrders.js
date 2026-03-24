import { useState, useEffect, useCallback } from 'react';
import { getOrders, updateOrderStatus } from '../api/orders';

const POLLING_INTERVAL = 15000;

function useOrders(tenantSlug = 'yuki', autoRefresh = true) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchOrders = useCallback(async () => {
    try {
      const data = await getOrders(tenantSlug);
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar las órdenes');
    }
  }, [tenantSlug]);
  
  const changeStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, estado: newStatus } : order
      ));
      return true;
    } catch (err) {
      setError(err.message || 'Error al actualizar el estado');
      return false;
    }
  };
  
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await fetchOrders();
      setLoading(false);
    };
    
    loadOrders();
    
    if (autoRefresh) {
      const interval = setInterval(fetchOrders, POLLING_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [fetchOrders, autoRefresh]);
  
  return { orders, loading, error, refetch: fetchOrders, changeStatus };
}

export default useOrders;
