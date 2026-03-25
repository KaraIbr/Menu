import { useRef, useEffect } from 'react';

const CategoryBar = ({ categories, selectedCategory, onSelectCategory }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current && selectedCategory) {
      const button = scrollRef.current.querySelector(`[data-id="${selectedCategory}"]`);
      if (button) {
        button.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedCategory]);

  return (
    <nav 
      ref={scrollRef}
      className="flex gap-3 px-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 bg-paper sticky top-[72px] z-30 border-b border-ink/10"
    >
      <button
        onClick={() => onSelectCategory(null)}
        data-id="all"
        className={`flex-shrink-0 px-6 py-3 rounded-full border-2 font-fredoka font-semibold text-lg transition-all duration-150 touch-target snap-center ${
          selectedCategory === null
            ? 'bg-cobalt text-nano border-ink shadow-doodle-sm'
            : 'bg-nano text-ink border-ink/30 active:scale-95'
        }`}
      >
        Todo
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          data-id={category.id}
          className={`flex-shrink-0 px-6 py-3 rounded-full border-2 font-fredoka font-semibold text-lg transition-all duration-150 touch-target snap-center ${
            selectedCategory === category.id
              ? 'bg-cobalt text-nano border-ink shadow-doodle-sm'
              : 'bg-nano text-ink border-ink/30 active:scale-95'
          }`}
        >
          {category.nombre}
        </button>
      ))}
    </nav>
  );
};

export default CategoryBar;
