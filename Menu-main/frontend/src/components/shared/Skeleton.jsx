const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="skeleton h-40 w-full mb-4" />
    <div className="skeleton h-6 w-3/4 mb-2" />
    <div className="skeleton h-4 w-1/2" />
  </div>
);

const SkeletonCategoryBar = () => (
  <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide py-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="skeleton h-12 w-28 flex-shrink-0 rounded-full" />
    ))}
  </div>
);

const SkeletonProductGrid = () => (
  <div className="grid grid-cols-2 gap-4 p-4">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export { SkeletonCard, SkeletonCategoryBar, SkeletonProductGrid };
