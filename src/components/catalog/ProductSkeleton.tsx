export default function ProductSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden animate-pulse">
      {/* Image */}
      <div className="h-52 sm:h-56 bg-gray-100" />
      {/* Content */}
      <div className="p-4 space-y-2.5">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded-sm" />
          ))}
        </div>
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-2.5 w-24 bg-gray-100 rounded" />
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
        <div className="flex items-end justify-between pt-3 border-t border-gray-50 mt-2">
          <div>
            <div className="h-2 w-12 bg-gray-100 rounded mb-1" />
            <div className="h-5 w-20 bg-gray-100 rounded" />
          </div>
          <div className="h-3 w-10 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}
