import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Badge from "./Badge.jsx";
import { formatCompact } from "../services/analytics.js";

export default function TrendCard({ trend, active, onClick }) {
  const positive = trend.growth >= 0;
  return (
    <button
      onClick={onClick}
      className={`text-left surface-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-popover ${
        active ? "ring-2 ring-signal-400 ring-offset-2 ring-offset-ink-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-medium text-ink-900 text-sm">{trend.name}</p>
        <Badge variant={trend.status.toLowerCase()}>{trend.status}</Badge>
      </div>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className={`text-lg font-display font-semibold flex items-center gap-1 ${positive ? "text-signal2-600" : "text-rose-500"}`}>
            {positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {positive ? "+" : ""}
            {trend.growth}%
          </p>
          <p className="text-xs text-ink-400 mt-1">
            {formatCompact(trend.mentions)} mentions · {formatCompact(trend.engagement)} engagement
          </p>
        </div>
        <div className="h-10 w-20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend.series}>
              <defs>
                <linearGradient id={`tsp-${trend.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00A891" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#00A891" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#00A891" strokeWidth={1.5} fill={`url(#tsp-${trend.id})`} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-2 h-1 rounded-full bg-ink-100 overflow-hidden">
        <div className="h-full bg-signal-500 rounded-full" style={{ width: `${trend.momentum}%` }} />
      </div>
      <p className="text-[11px] text-ink-400 mt-1">Momentum {trend.momentum}/100</p>
    </button>
  );
}
