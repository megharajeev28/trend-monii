export function SkeletonLine({ className = "" }) {
  return <div className={`skeleton h-4 ${className}`} />;
}

export function SkeletonCard({ className = "" }) {
  return (
    <div className={`surface-card p-5 ${className}`}>
      <div className="skeleton h-3 w-24 mb-3" />
      <div className="skeleton h-7 w-32 mb-2" />
      <div className="skeleton h-3 w-20" />
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols = 5 }) {
  return (
    <div className="surface-card p-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 py-3.5 border-b border-ink-50 last:border-0">
          {Array.from({ length: cols }).map((__, c) => (
            <div key={c} className="skeleton h-3.5 flex-1" style={{ maxWidth: c === 0 ? 160 : 90 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ height = 280 }) {
  return <div className="surface-card p-5"><div className="skeleton w-full" style={{ height }} /></div>;
}
