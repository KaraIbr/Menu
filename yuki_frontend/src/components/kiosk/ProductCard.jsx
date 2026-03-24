import { Coffee } from 'lucide-react';
import { getMediaUrl } from '../../api/axios';

function ProductCard({ product, onClick }) {
  const imageUrl = getMediaUrl(product.imagen);
  const precio = parseFloat(product.precio_base).toFixed(2);
  
  return (
    <button
      onClick={() => onClick(product)}
      disabled={!product.disponible}
      className={`bg-white rounded-2xl shadow-md overflow-hidden text-left transition-all w-full ${
        product.disponible 
          ? 'hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer' 
          : 'opacity-50 cursor-not-allowed'
      }`}
    >
      <div className="aspect-square bg-yuki-surface relative overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yuki-purple-light to-yuki-teal-light">
            <Coffee className="w-16 h-16 text-yuki-purple opacity-50" />
          </div>
        )}
        {!product.disponible && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-yuki-ink text-white px-3 py-1 rounded-full text-xs font-medium">
              Agotado
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-yuki-ink text-base leading-tight mb-1">
          {product.nombre}
        </h3>
        {product.descripcion && (
          <p className="text-yuki-muted text-xs leading-relaxed mb-3 line-clamp-2">
            {product.descripcion}
          </p>
        )}
        <p className="text-yuki-purple font-bold text-lg">
          ${precio}
        </p>
      </div>
    </button>
  );
}

export default ProductCard;
