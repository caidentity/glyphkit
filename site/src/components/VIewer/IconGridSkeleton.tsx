const IconGridSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className="animate-pulse flex flex-col items-center p-4 border rounded-lg"
        >
          <div className="w-16 h-16 bg-gray-200 rounded-md mb-2" />
          <div className="w-20 h-4 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
};

export default IconGridSkeleton; 