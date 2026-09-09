const VARIANTS = {
  high: "bg-rose-400/10 text-rose-500",
  medium: "bg-amber-400/10 text-amber-500",
  low: "bg-ink-100 text-ink-500",
  positive: "bg-signal2-400/10 text-signal2-600",
  negative: "bg-rose-400/10 text-rose-500",
  neutral: "bg-ink-100 text-ink-500",
  emerging: "bg-signal-50 text-signal-700",
  rising: "bg-signal2-400/10 text-signal2-600",
  stable: "bg-ink-100 text-ink-500",
  declining: "bg-rose-400/10 text-rose-500",
  demo: "bg-amber-400/10 text-amber-500",
};

export default function Badge({ children, variant = "neutral", className = "", dot = false }) {
  const key = String(variant).toLowerCase();
  return (
    <span className={`badge ${VARIANTS[key] || VARIANTS.neutral} ${className}`}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}
