export default function LoadingSkeleton({ type = 'card', count = 6 }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16" />
              <div className="h-6 bg-gray-200 rounded-full w-20" />
              <div className="h-6 bg-gray-200 rounded-full w-14" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-8" />
        <div className="h-[400px] bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />;
}