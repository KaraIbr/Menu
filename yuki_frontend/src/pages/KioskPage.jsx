import { useState, useMemo } from 'react';
import { ShoppingCart } from 'lucide-react';
import Navbar from '../components/shared/Navbar';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import CategoryBar from '../components/kiosk/CategoryBar';
import ProductGrid from '../components/kiosk/ProductGrid';
import ProductModal from '../components/kiosk/ProductModal';
import CartDrawer from '../components/kiosk/CartDrawer';
import OrderConfirm from '../components/kiosk/OrderConfirm';
import useMenu from '../hooks/useMenu';
import useCartStore from '../store/cartStore';

function KioskPage() {
  const { menu, loading, error } = useMenu();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const itemCount = useCartStore(state => state.getItemCount());
  
  const filteredProducts = useMemo(() => {
    if (!menu) return [];
    if (selectedCategory === null) {
      return menu.categories.flatMap(cat => cat.products);
    }
    const category = menu.categories.find(cat => cat.id === selectedCategory);
    return category ? category.products : [];
  }, [menu, selectedCategory]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-yuki-surface flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando menú..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-yuki-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😔</span>
          </div>
          <h2 className="text-xl font-semibold text-yuki-ink mb-2">
            Error al cargar
          </h2>
          <p className="text-yuki-muted">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-yuki-surface">
      <Navbar showBaristaLink />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-yuki-ink mb-2">
            {menu?.tenant?.nombre || 'Yuki'}
          </h1>
          <p className="text-yuki-muted">Tu ritual, tu manera</p>
        </div>
        
        <CategoryBar
          categories={menu?.categories || []}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        <ProductGrid
          products={filteredProducts}
          onProductClick={setSelectedProduct}
        />
      </div>
      
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-yuki-purple text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-30"
      >
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 w-7 h-7 bg-yuki-teal rounded-full flex items-center justify-center text-sm font-bold">
            {itemCount}
          </span>
        )}
      </button>
      
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onConfirm={() => {
          setIsCartOpen(false);
          setIsConfirmOpen(true);
        }}
      />
      
      <OrderConfirm
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        tenantId={menu?.tenant?.id}
      />
    </div>
  );
}

export default KioskPage;
