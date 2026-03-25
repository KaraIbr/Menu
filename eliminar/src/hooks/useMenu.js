import { useState, useEffect } from 'react';
import { getMenu } from '../api/menu';

function useMenu(slug = 'yuki') {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMenu(slug);
      setMenu(data);
    } catch (err) {
      setError(err.message || 'Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMenu();
  }, [slug]);
  
  return { menu, loading, error, refetch: fetchMenu };
}

export default useMenu;
