function LoadingSpinner({ size = 'md', text = '' }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div 
        className={`${sizeClasses[size]} border-4 border-yuki-purple-light border-t-yuki-purple rounded-full animate-spin`}
      />
      {text && (
        <p className="text-yuki-muted text-sm">{text}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;
