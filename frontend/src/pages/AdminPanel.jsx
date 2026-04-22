import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Package, 
  Plus, 
  PencilSimple, 
  Trash, 
  X,
  Coffee,
  ForkKnife,
  UserPlus,
  ShieldCheck
} from '@phosphor-icons/react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import {
  getPersonalList,
  createPersonal,
  updatePersonal,
  deletePersonal,
  getCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/menu';

const AdminPanel = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [activeTab, setActiveTab] = useState('personal');
  
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-cobalt text-nano p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-nano/20 flex items-center justify-center transition-all duration-150 active:scale-95"
            >
              <ArrowLeft size={20} weight="bold" />
            </button>
            <div>
              <h1 className="font-fredoka font-bold text-xl">Panel de Administracion</h1>
              <p className="font-poppins text-sm text-nano/70">
                Bienvenido, {user?.nombre} ({user?.rol})
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-nano/20 font-poppins text-sm hover:bg-nano/30 transition-colors"
          >
            Cerrar sesion
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-fredoka font-semibold transition-all ${
              activeTab === 'personal'
                ? 'bg-cobalt text-nano shadow-lg'
                : 'bg-nano text-ink hover:bg-nano/80'
            }`}
          >
            <Users size={20} weight="bold" />
            Personal
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-fredoka font-semibold transition-all ${
              activeTab === 'categories'
                ? 'bg-cobalt text-nano shadow-lg'
                : 'bg-nano text-ink hover:bg-nano/80'
            }`}
          >
            <ForkKnife size={20} weight="bold" />
            Categorias
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-fredoka font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-cobalt text-nano shadow-lg'
                : 'bg-nano text-ink hover:bg-nano/80'
            }`}
          >
            <Package size={20} weight="bold" />
            Productos
          </button>
        </div>

        {activeTab === 'personal' && <PersonalSection />}
        {activeTab === 'categories' && <CategoriesSection />}
        {activeTab === 'products' && <ProductsSection />}
      </div>
    </div>
  );
};

const PersonalSection = () => {
  const [personals, setPersonals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(null);

  const loadPersonals = async () => {
    try {
      const data = await getPersonalList();
      setPersonals(data);
    } catch (error) {
      toast.error('Error al cargar personal');
    }
  };

  useEffect(() => {
    loadPersonals();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Estas seguro de eliminar este usuario?')) return;
    try {
      await deletePersonal(id);
      toast.success('Personal eliminado');
      loadPersonals();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="bg-nano rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-fredoka font-bold text-2xl text-ink">Gestionar Personal</h2>
        <button
          onClick={() => { setEditingPersonal(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-cobalt text-nano rounded-xl font-poppins font-semibold hover:bg-cobalt/90 transition-colors"
        >
          <UserPlus size={20} weight="bold" />
          Nuevo Personal
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-ink/10">
              <th className="text-left py-3 px-4 font-fredoka text-ink/60">Nombre</th>
              <th className="text-left py-3 px-4 font-fredoka text-ink/60">Usuario</th>
              <th className="text-left py-3 px-4 font-fredoka text-ink/60">Rol</th>
              <th className="text-left py-3 px-4 font-fredoka text-ink/60">Estado</th>
              <th className="text-right py-3 px-4 font-fredoka text-ink/60">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personals.map((p) => (
              <tr key={p.id} className="border-b border-ink/5 hover:bg-ink/5">
                <td className="py-3 px-4 font-poppins text-ink">{p.nombre}</td>
                <td className="py-3 px-4 font-poppins text-ink/70">{p.username}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-poppins font-semibold ${
                    p.rol === 'admin'
                      ? 'bg-cobalt/20 text-cobalt'
                      : p.rol === 'barista'
                        ? 'bg-coffee/20 text-coffee'
                        : 'bg-coral/20 text-coral'
                  }`}>
                    {p.rol === 'admin' ? 'Admin' : p.rol === 'barista' ? 'Barista' : 'Cocinero'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-poppins font-semibold ${
                    p.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setEditingPersonal(p); setIsModalOpen(true); }}
                      className="p-2 rounded-lg bg-cobalt/10 text-cobalt hover:bg-cobalt/20 transition-colors"
                    >
                      <PencilSimple size={18} weight="bold" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-lg bg-coral/10 text-coral hover:bg-coral/20 transition-colors"
                    >
                      <Trash size={18} weight="bold" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <PersonalModal
          personal={editingPersonal}
          onClose={() => setIsModalOpen(false)}
          onSave={loadPersonals}
        />
      )}
    </div>
  );
};

const PersonalModal = ({ personal, onClose, onSave }) => {
  const [form, setForm] = useState({
    nombre: personal?.nombre || '',
    username: personal?.username || '',
    password: '',
    rol: personal?.rol || 'barista',
    activo: personal?.activo ?? true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.username || (!personal && !form.password)) {
      toast.error('Completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      const data = { ...form };
      if (!data.password) delete data.password;
      
      if (personal) {
        await updatePersonal(personal.id, data);
        toast.success('Personal actualizado');
      } else {
        await createPersonal(data);
        toast.success('Personal creado');
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error('Error al guardar');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
      <div className="bg-nano rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-fredoka font-bold text-xl text-ink">
            {personal ? 'Editar Personal' : 'Nuevo Personal'}
          </h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-poppins text-sm text-ink/70 mb-1">Nombre completo</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-ink/20 focus:border-cobalt focus:outline-none font-poppins"
              placeholder="Juan Perez"
            />
          </div>

          <div>
            <label className="block font-poppins text-sm text-ink/70 mb-1">Usuario</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-ink/20 focus:border-cobalt focus:outline-none font-poppins"
              placeholder="jperez"
            />
          </div>

          <div>
            <label className="block font-poppins text-sm text-ink/70 mb-1">
              Contraseña {personal && '(dejar vacio para mantener)'}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-ink/20 focus:border-cobalt focus:outline-none font-poppins"
              placeholder="********"
            />
          </div>

          <div>
            <label className="block font-poppins text-sm text-ink/70 mb-2">Rol</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, rol: 'admin' })}
                className={`py-3 rounded-xl font-poppins font-semibold transition-all ${
                  form.rol === 'admin'
                    ? 'bg-cobalt text-nano'
                    : 'bg-ink/10 text-ink/70 hover:bg-ink/20'
                }`}
              >
                <ShieldCheck size={20} className="inline mr-2" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, rol: 'barista' })}
                className={`py-3 rounded-xl font-poppins font-semibold transition-all ${
                  form.rol === 'barista'
                    ? 'bg-coffee text-nano'
                    : 'bg-ink/10 text-ink/70 hover:bg-ink/20'
                }`}
              >
                <Coffee size={20} className="inline mr-2" />
                Barista
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, rol: 'cocinero' })}
                className={`py-3 rounded-xl font-poppins font-semibold transition-all ${
                  form.rol === 'cocinero'
                    ? 'bg-coral text-nano'
                    : 'bg-ink/10 text-ink/70 hover:bg-ink/20'
                }`}
              >
                <ForkKnife size={20} className="inline mr-2" />
                Cocinero
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="activo"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-ink/30"
            />
            <label htmlFor="activo" className="font-poppins text-ink">Usuario activo</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-cobalt text-nano rounded-xl font-fredoka font-bold text-lg hover:bg-cobalt/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
};

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const loadCategories = async () => {
    try {
      const data = await getCategoriesAdmin();
      setCategories(data);
    } catch (error) {
      toast.error('Error al cargar categorias');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Estas seguro de eliminar esta categoria?')) return;
    try {
      await deleteCategory(id);
      toast.success('Categoria eliminada');
      loadCategories();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="bg-nano rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-fredoka font-bold text-2xl text-ink">Gestionar Categorias</h2>
        <button
          onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-cobalt text-nano rounded-xl font-poppins font-semibold hover:bg-cobalt/90 transition-colors"
        >
          <Plus size={20} weight="bold" />
          Nueva Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-paper p-4 rounded-xl border-2 border-ink/10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-fredoka font-bold text-lg text-ink">{cat.nombre}</h3>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-poppins font-semibold ${
                  cat.tipo === 'bebida' ? 'bg-coffee/20 text-coffee' : 'bg-coral/20 text-coral'
                }`}>
                  {cat.tipo === 'bebida' ? 'Bebida' : 'Comida'}
                </span>
                {cat.descripcion && (
                  <p className="mt-2 font-poppins text-sm text-ink/60">{cat.descripcion}</p>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }}
                  className="p-2 rounded-lg bg-cobalt/10 text-cobalt hover:bg-cobalt/20 transition-colors"
                >
                  <PencilSimple size={16} weight="bold" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 rounded-lg bg-coral/10 text-coral hover:bg-coral/20 transition-colors"
                >
                  <Trash size={16} weight="bold" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setIsModalOpen(false)}
          onSave={loadCategories}
        />
      )}
    </div>
  );
};

const CategoryModal = ({ category, onClose, onSave }) => {
  const [form, setForm] = useState({
    nombre: category?.nombre || '',
    descripcion: category?.descripcion || '',
    tipo: category?.tipo || 'comida',
    orden: category?.orden || 0,
    activo: category?.activo ?? true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre) {
      toast.error('El nombre es requerido');
      return;
    }

    setIsLoading(true);
    try {
      if (category) {
        await updateCategory(category.id, form);
        toast.success('Categoria actualizada');
      } else {
        await createCategory(form);
        toast.success('Categoria creada');
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error('Error al guardar');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
      <div className="bg-nano rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-fredoka font-bold text-xl text-ink">
            {category ? 'Editar Categoria' : 'Nueva Categoria'}
          </h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-poppins text-sm text-ink/70 mb-1">Nombre</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-ink/20 focus:border-cobalt focus:outline-none font-poppins"
            />
          </div>

          <div>
            <label className="block font-poppins text-sm text-ink/70 mb-1">Descripcion</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-ink/20 focus:border-cobalt focus:outline-none font-poppins resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block font-poppins text-sm text-ink/70 mb-2">Tipo</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setForm({ ...form, tipo: 'comida' })}
                className={`flex-1 py-3 rounded-xl font-poppins font-semibold transition-all ${
                  form.tipo === 'comida'
                    ? 'bg-coral text-nano'
                    : 'bg-ink/10 text-ink/70 hover:bg-ink/20'
                }`}
              >
                <ForkKnife size={20} className="inline mr-2" />
                Comida
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, tipo: 'bebida' })}
                className={`flex-1 py-3 rounded-xl font-poppins font-semibold transition-all ${
                  form.tipo === 'bebida'
                    ? 'bg-coffee text-nano'
                    : 'bg-ink/10 text-ink/70 hover:bg-ink/20'
                }`}
              >
                <Coffee size={20} className="inline mr-2" />
                Bebida
              </button>
            </div>
          </div>

          <div>
            <label className="block font-poppins text-sm text-ink/70 mb-1">Orden</label>
            <input
              type="number"
              value={form.orden}
              onChange={(e) => setForm({ ...form, orden: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-xl border-2 border-ink/20 focus:border-cobalt focus:outline-none font-poppins"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="catActivo"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              className="w-5 h-5 rounded border-2 border-ink/30"
            />
            <label htmlFor="catActivo" className="font-poppins text-ink">Categoria activa</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-cobalt text-nano rounded-xl font-fredoka font-bold text-lg hover:bg-cobalt/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const loadProducts = async () => {
    try {
      const params = filterType !== 'all' ? { rol: filterType } : {};
      const data = await getProductsAdmin(params);
      setProducts(data);
    } catch (error) {
      toast.error('Error al cargar productos');
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategoriesAdmin();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories');
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [filterType]);

  const getCategoryForProduct = (product) => {
    if (product?.category) {
      return categories.find((category) => category.id === product.category) || {};
    }

    return (
      categories.find((category) =>
        category.products?.some((categoryProduct) => categoryProduct.id === product.id)
      ) || {}
    );
  };

  const handleDelete = async (id) => {
    if (!confirm('Estas seguro de eliminar este producto?')) return;
    try {
      await deleteProduct(id);
      toast.success('Producto eliminado');
      loadProducts();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="bg-nano rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-fredoka font-bold text-2xl text-ink">Gestionar Productos</h2>
        <div className="flex gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-xl border-2 border-ink/20 font-poppins focus:border-cobalt focus:outline-none"
          >
            <option value="all">Todos</option>
            <option value="barista">Solo bebidas</option>
            <option value="cocinero">Solo comida</option>
          </select>
          <button
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-cobalt text-nano rounded-xl font-poppins font-semibold hover:bg-cobalt/90 transition-colors"
          >
            <Plus size={20} weight="bold" />
            Nuevo Producto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const category = getCategoryForProduct(product);
          return (
            <div key={product.id} className="bg-paper p-4 rounded-xl border-2 border-ink/10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-fredoka font-bold text-lg text-ink">{product.nombre}</h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-poppins font-semibold ${
                    category.tipo === 'bebida' ? 'bg-coffee/20 text-coffee' : 'bg-coral/20 text-coral'
                  }`}>
                    {category.nombre || 'Sin categoria'}
                  </span>
                  <p className="mt-2 font-poppins font-bold text-cobalt text-lg">
                    ${parseFloat(product.precio_base).toFixed(2)}
                  </p>
                  {product.descripcion && (
                    <p className="mt-1 font-poppins text-sm text-ink/60">{product.descripcion}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                    className="p-2 rounded-lg bg-cobalt/10 text-cobalt hover:bg-cobalt/20 transition-colors"
                  >
                    <PencilSimple size={16} weight="bold" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg bg-coral/10 text-coral hover:bg-coral/20 transition-colors"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                {!product.activo && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Inactivo</span>}
                {!product.disponible && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">No disponible</span>}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          defaultCategoryId={editingProduct ? getCategoryForProduct(editingProduct).id : ''}
          onClose={() => setIsModalOpen(false)}
          onSave={loadProducts}
        />
      )}
    </div>
  );
};

const ProductModal = ({ product, categories, defaultCategoryId, onClose, onSave }) => {
  const [form, setForm] = useState({
    nombre: product?.nombre || '',
    category: product?.category || defaultCategoryId || '',
    descripcion: product?.descripcion || '',
    precio_base: product?.precio_base || '',
    activo: product?.activo ?? true,
    disponible: product?.disponible ?? true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.category || !form.precio_base) {
      toast.error('Completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      const data = { ...form, precio_base: parseFloat(form.precio_base) };
      if (product) {
        await updateProduct(product.id, data);
        toast.success('Producto actualizado');
      } else {
        await createProduct(data);
        toast.success('Producto creado');
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error('Error al guardar');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
      <div className="bg-nano rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-fredoka font-bold text-xl text-ink">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-poppins text-sm text-ink/70 mb-1">Nombre</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-ink/20 focus:border-cobalt focus:outline-none font-poppins"
            />
          </div>

          <div>
            <label className="block font-poppins text-sm text-ink/70 mb-1">Categoria</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border-2 border-ink/20 focus:border-cobalt focus:outline-none font-poppins"
            >
              <option value="">Seleccionar categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre} ({cat.tipo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-poppins text-sm text-ink/70 mb-1">Precio</label>
            <input
              type="number"
              step="0.01"
              value={form.precio_base}
              onChange={(e) => setForm({ ...form, precio_base: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-ink/20 focus:border-cobalt focus:outline-none font-poppins"
            />
          </div>

          <div>
            <label className="block font-poppins text-sm text-ink/70 mb-1">Descripcion</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-ink/20 focus:border-cobalt focus:outline-none font-poppins resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="prodActivo"
                checked={form.activo}
                onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-ink/30"
              />
              <label htmlFor="prodActivo" className="font-poppins text-ink text-sm">Activo</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="prodDisp"
                checked={form.disponible}
                onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-ink/30"
              />
              <label htmlFor="prodDisp" className="font-poppins text-ink text-sm">Disponible</label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-cobalt text-nano rounded-xl font-fredoka font-bold text-lg hover:bg-cobalt/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
