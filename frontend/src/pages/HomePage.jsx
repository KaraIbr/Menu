import { useNavigate } from 'react-router-dom';
import { Coffee, ChefHat } from '@phosphor-icons/react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="font-fredoka font-bold text-5xl text-cobalt mb-2">Yuki</h1>
        <p className="font-poppins text-ink/70 text-lg">Tu pedido, tu manera</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 max-w-md w-full">
        <button
          onClick={() => navigate('/kiosk')}
          className="flex-1 bg-nano rounded-3xl border-2 border-ink shadow-doodle p-8 transition-all duration-150 active:scale-95 active:shadow-none flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 bg-cobalt/10 rounded-full flex items-center justify-center">
            <Coffee size={48} weight="duotone" className="text-cobalt" />
          </div>
          <div className="text-center">
            <h2 className="font-fredoka font-semibold text-2xl text-ink mb-1">
              Soy Cliente
            </h2>
            <p className="font-poppins text-ink/60 text-sm">
              Hacer mi pedido
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate('/login')}
          className="flex-1 bg-nano rounded-3xl border-2 border-ink shadow-doodle p-8 transition-all duration-150 active:scale-95 active:shadow-none flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 bg-cobalt/10 rounded-full flex items-center justify-center">
            <ChefHat size={48} weight="duotone" className="text-cobalt" />
          </div>
          <div className="text-center">
            <h2 className="font-fredoka font-semibold text-2xl text-ink mb-1">
              Soy Sucursal
            </h2>
            <p className="font-poppins text-ink/60 text-sm">
              Ver pedidos
            </p>
          </div>
        </button>
      </div>

      <p className="mt-12 font-poppins text-ink/40 text-sm">
        ¿Qué te gustaría hacer hoy?
      </p>
    </div>
  );
};

export default HomePage;
