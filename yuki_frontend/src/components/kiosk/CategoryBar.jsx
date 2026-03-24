import { Leaf, Coffee, CupSoda, Cookie } from 'lucide-react';

const iconMap = {
  leaf: Leaf,
  coffee: Coffee,
  'cup-soda': CupSoda,
  cookie: Cookie
};

function CategoryBar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="bg-white rounded-2xl p-2 shadow-sm overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        <button
          onClick={() => onSelectCategory(null)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
            selectedCategory === null
              ? 'bg-yuki-purple text-white shadow-md'
              : 'bg-yuki-surface text-yuki-ink hover:bg-yuki-purple-light'
          }`}
        >
          <span className="text-lg">✨</span>
          Todos
        </button>
        
        {categories.map((category) => {
          const IconComponent = iconMap[category.icono] || Coffee;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-yuki-purple text-white shadow-md'
                  : 'bg-yuki-surface text-yuki-ink hover:bg-yuki-purple-light'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              {category.nombre}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryBar;
