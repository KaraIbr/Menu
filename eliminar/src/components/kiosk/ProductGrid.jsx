import ProductCard from './ProductCard';

function ProductGrid({ products, onProductClick }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-yuki-purple-light rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">☕</span>
        </div>
        <h3 className="text-yuki-ink font-semibold text-lg mb-2">
          No hay productos
        </h3>
        <p className="text-yuki-muted text-sm">
          No hay productos disponibles en esta categoría
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
