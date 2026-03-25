import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { loginBarista } from '../api/orders';
import useAuthStore from '../store/authStore';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await loginBarista(data.email, data.password);
      login(result.access);
      navigate('/barista');
    } catch (err) {
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-yuki-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-yuki-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">☕</span>
          </div>
          <h1 className="text-3xl font-semibold text-yuki-ink">Panel Barista</h1>
          <p className="text-yuki-muted mt-2">Ingresa tus credenciales</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-yuki-ink mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'El correo es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo inválido'
                }
              })}
              placeholder="barista@yuki.com"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-yuki-purple'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-yuki-ink mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { 
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 4,
                    message: 'Mínimo 4 caracteres'
                  }
                })}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-yuki-purple'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-yuki-muted hover:text-yuki-purple transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-yuki-purple text-white rounded-full font-semibold text-lg hover:bg-yuki-purple-dark shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Iniciar sesión
              </>
            )}
          </button>
        </form>
        
        <p className="text-center text-yuki-muted text-xs mt-6">
          Demo: barista@yuki.com / yuki123
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
