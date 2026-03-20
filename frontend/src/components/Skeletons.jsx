export function ProductSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 rounded-lg w-3/4" />
        <div className="skeleton h-3 rounded-lg w-full" />
        <div className="skeleton h-3 rounded-lg w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-6 rounded-lg w-16" />
          <div className="skeleton h-8 rounded-xl w-20" />
        </div>
      </div>
    </div>
  )
}

export function ServiceSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <div className="skeleton w-14 h-14 rounded-2xl" />
      <div className="skeleton h-5 rounded-lg w-2/3" />
      <div className="skeleton h-3 rounded-lg w-full" />
      <div className="skeleton h-3 rounded-lg w-3/4" />
      <div className="skeleton h-4 rounded-lg w-1/3" />
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="card p-6 space-y-3">
      <div className="skeleton h-4 rounded-lg w-1/2" />
      <div className="skeleton h-8 rounded-lg w-2/3" />
      <div className="skeleton h-3 rounded-lg w-1/3" />
    </div>
  )
}
