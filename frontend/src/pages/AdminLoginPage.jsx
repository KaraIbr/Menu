import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, Eye, EyeSlash, ShieldCheck } from '@phosphor-icons/react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Completa todos los campos');
      return;
    }

    setIsLoading(true);
    const user = await login(username, password);
    setIsLoading(false);

    if (user) {
      navigate('/admin');
    } else {
      toast.error('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="p-4">
        <button
          onClick={() => navigate('/')}
          className="w-12 h-12 rounded-full bg-nano border-2 border-ink shadow-doodle-sm flex items-center justify-center transition-all duration-150 active:scale-95 active:shadow-none"
        >
          <ArrowLeft size={24} weight="bold" />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cobalt/10 flex items-center justify-center">
              <ShieldCheck size={48} weight="fill" className="text-cobalt" />
            </div>
            <h1 className="font-fredoka font-bold text-4xl text-cobalt mb-2">
              Panel Admin
            </h1>
            <p className="font-poppins text-ink/60">
              Gestiona personal y productos
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-fredoka font-semibold text-ink mb-2">
                Usuario
              </label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nombre de usuario"
                  className="w-full pl-12 pr-4 py-4 bg-nano rounded-2xl border-2 border-ink/20 font-poppins text-ink placeholder:text-ink/40 focus:outline-none focus:border-cobalt"
                />
              </div>
            </div>

            <div>
              <label className="block font-fredoka font-semibold text-ink mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full pl-12 pr-12 py-4 bg-nano rounded-2xl border-2 border-ink/20 font-poppins text-ink placeholder:text-ink/40 focus:outline-none focus:border-cobalt"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-6"
            >
              {isLoading ? 'Ingresando...' : 'Ingresar al Panel'}
            </button>
          </form>

          <button
            onClick={() => navigate('/login')}
            className="w-full mt-4 py-3 font-poppins text-sm text-ink/60 hover:text-cobalt transition-colors"
          >
            Ir a panel de pedidos
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
