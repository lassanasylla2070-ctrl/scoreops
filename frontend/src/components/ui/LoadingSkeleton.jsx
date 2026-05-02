// Shimmer skeleton components
export function MatchSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex justify-between">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-3 w-10" />
      </div>
      <div className="flex items-center gap-3">
        <div className="skeleton w-7 h-7 rounded-full" />
        <div className="skeleton h-4 flex-1" />
        <div className="skeleton h-6 w-6" />
      </div>
      <div className="flex items-center gap-3">
        <div className="skeleton w-7 h-7 rounded-full" />
        <div className="skeleton h-4 flex-1" />
        <div className="skeleton h-6 w-6" />
      </div>
    </div>
  );
}

export function PlayerSkeleton() {
  return (
    <div className="card p-4">
      <div className="flex gap-3 mb-3">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      <div className="skeleton h-3 w-full" />
    </div>
  );
}

export function NewsSkeleton({ featured = false }) {
  return (
    <div className={`card overflow-hidden ${featured ? 'md:flex' : ''}`}>
      {featured && <div className="skeleton md:w-72 h-40 rounded-none" />}
      {!featured && <div className="skeleton h-40 rounded-none" />}
      <div className="p-4 flex-1 space-y-2">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-4/5" />
        <div className="skeleton h-3 w-3/5" />
      </div>
    </div>
  );
}

export function StandingsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2 px-3">
          <div className="skeleton w-4 h-4" />
          <div className="skeleton w-5 h-5 rounded-full" />
          <div className="skeleton h-4 flex-1" />
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="skeleton h-4 w-8" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className={`skeleton h-4 ${j === 1 ? 'flex-1' : 'w-16'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
