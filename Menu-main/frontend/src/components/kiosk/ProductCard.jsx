import { ShoppingCart } from '@phosphor-icons/react';
import { getFullImageUrl } from '../../api/menu';

const ProductCard = ({ product, onClick }) => {
  const imageUrl = getFullImageUrl(product.imagen);
  const isAvailable = product.disponible && product.activo;

  return (
    <button
      onClick={() => isAvailable && onClick(product)}
      disabled={!isAvailable}
      className={`card text-left transition-all duration-150 ${
        isAvailable ? 'active:scale-[0.98] cursor-pointer' : 'opacity-50 cursor-not-allowed'
      }`}
    >
      <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-paper mb-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.nombre}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart size={48} weight="duotone" className="text-ink/20" />
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
            <span className="bg-nano px-3 py-1 rounded-full font-fredoka font-semibold text-sm">
              Agotado
            </span>
          </div>
        )}
      </div>
      
      <h3 className="font-fredoka font-semibold text-lg text-ink mb-1 line-clamp-2">
        {product.nombre}
      </h3>
      
      {product.descripcion && (
        <p className="font-poppins text-sm text-ink/60 mb-2 line-clamp-2">
          {product.descripcion}
        </p>
      )}
      
      <p className="font-fredoka font-bold text-xl text-cobalt">
        ${parseFloat(product.precio_base).toFixed(2)}
      </p>
    </button>
  );
};

const ProductGrid = ({ products, onProductClick }) => {
  if (!products || products.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="font-poppins text-ink/60">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
        />
      ))}
    </div>
  );
};

export { ProductCard, ProductGrid };
