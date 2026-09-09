export default function ChartCard({ title, subtitle, actions, children, height = 300 }) {
  return (
    <div className="surface-card p-5">
      {(title || actions) && (
        <div className="flex items-start justify-between mb-4 gap-3">
          <div>
            {title && <h3 className="font-semibold text-ink-900 text-sm">{title}</h3>}
            {subtitle && <p className="text-xs text-ink-400 mt-0.5">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      <div style={{ height }}>{children}</div>
    </div>
  );
}
