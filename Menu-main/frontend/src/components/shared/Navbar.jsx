import { ShoppingCart } from '@phosphor-icons/react';
import useCartStore from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ showCart = true, onCartClick }) => {
  const itemCount = useCartStore((state) => state.getItemCount());
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-paper border-b-2 border-ink px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <button
          onClick={() => navigate('/')}
          className="font-fredoka font-bold text-2xl text-cobalt touch-target flex items-center"
        >
          Yuki
        </button>
        
        {showCart && (
          <button
            onClick={onCartClick}
            className="relative bg-nano rounded-2xl border-2 border-ink shadow-doodle-sm p-3 transition-all duration-150 active:scale-95 active:shadow-none touch-target"
          >
            <ShoppingCart size={28} weight="bold" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-cobalt text-nano text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
