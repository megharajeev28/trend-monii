export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div>
        {eyebrow && <p className="text-sm text-signal-600 font-medium mb-1">{eyebrow}</p>}
        <h1 className="font-display text-2xl sm:text-[28px] font-semibold text-ink-950 tracking-tight">{title}</h1>
        {subtitle && <p className="text-ink-500 mt-1.5 max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
