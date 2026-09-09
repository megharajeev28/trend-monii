import * as Icons from "lucide-react";
import Badge from "./Badge.jsx";

export default function InsightCard({ insight }) {
  const Icon = Icons[insight.icon] || Icons.Sparkles;
  return (
    <div className="flex gap-3.5 p-4 rounded-xl border border-ink-100 hover:border-ink-200 transition-colors">
      <span className="h-9 w-9 rounded-lg bg-signal-50 text-signal-600 flex items-center justify-center shrink-0">
        <Icon size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-ink-900">{insight.title}</p>
          <Badge variant={insight.impact.toLowerCase()}>{insight.impact}</Badge>
        </div>
        <p className="text-sm text-ink-500 mt-1">{insight.explanation}</p>
        <p className="text-xs text-ink-400 mt-2 flex items-center gap-1.5">
          <Icons.ArrowRight size={12} className="text-signal-500" />
          <span className="text-ink-600 font-medium">Recommended:</span> {insight.action}
        </p>
      </div>
    </div>
  );
}
