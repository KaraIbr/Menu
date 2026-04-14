import { useState, useEffect, useCallback } from 'react';
import { getOrders } from '../api/menu';

const useOrders = (pollInterval = 15000) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, pollInterval);
    return () => clearInterval(interval);
  }, [fetchOrders, pollInterval]);

  const updateOrderInList = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  };

  return { orders, loading, error, refetch: fetchOrders, updateOrderInList };
};

export default useOrders;
