import { useState, useMemo } from 'react';
import Navbar from '../components/shared/Navbar';
import CategoryBar from '../components/kiosk/CategoryBar';
import { ProductGrid } from '../components/kiosk/ProductCard';
import ProductModal from '../components/kiosk/ProductModal';
import CartDrawer from '../components/kiosk/CartDrawer';
import { SkeletonCategoryBar, SkeletonProductGrid } from '../components/shared/Skeleton';
import useMenu from '../hooks/useMenu';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

const KioskPage = () => {
  const { categories, loading, error, refetch } = useMenu();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const products = useMemo(() => {
    if (!categories.length) return [];
    
    if (selectedCategory === null) {
      return categories.flatMap((cat) => cat.products || []);
    }
    
    const category = categories.find((cat) => cat.id === selectedCategory);
    return category?.products || [];
  }, [categories, selectedCategory]);

  const handleAddToCart = (product, modifiers, quantity, notes) => {
    addItem(product, modifiers, quantity, notes);
    toast.success(`${quantity}x ${product.nombre} agregado al carrito`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6">
        <p className="font-poppins text-ink/60 mb-4 text-center">
          No se pudo cargar el menú
        </p>
        <button onClick={refetch} className="btn-secondary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-24">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      {loading ? (
        <>
          <SkeletonCategoryBar />
          <SkeletonProductGrid />
        </>
      ) : (
        <>
          <CategoryBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          
          <ProductGrid
            products={products}
            onProductClick={setSelectedProduct}
          />
        </>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-cobalt text-nano rounded-full p-4 shadow-doodle transition-all duration-150 active:scale-95 active:shadow-none z-30 touch-target"
      >
        <span className="font-fredoka font-bold text-xl">
          Ver pedido
        </span>
      </button>
    </div>
  );
};

export default KioskPage;
